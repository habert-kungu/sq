const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  sources?: SourceDocument[]
}

export interface SourceDocument {
  id: string
  title: string
  score: number
  category: string
}

export interface ChatOptions {
  category?: string
  tags?: string[]
  searchLimit?: number
  contextChunksPerDoc?: number
}

class ChatAPI {
  /**
   * Send a chat message with RAG (uses knowledge base)
   * Returns an async generator for streaming responses
   */
  async *chat(message: string, options?: ChatOptions): AsyncGenerator<ChatMessage> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        ...options,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to send chat message')
    }

    if (!response.body) {
      throw new Error('Response body is null')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let currentMessage: ChatMessage | null = null
    let sources: SourceDocument[] = []

    while (true) {
      const { done, value } = await reader.read()
      
      if (done) {
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      
      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.trim() === '') continue
        
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          
          try {
            const parsed = JSON.parse(data)

            if (parsed.type === 'sources') {
              sources = parsed.sources
            } else if (parsed.type === 'text') {
              if (!currentMessage) {
                currentMessage = {
                  role: 'assistant',
                  content: parsed.text,
                  sources: sources.length > 0 ? sources : undefined,
                }
              } else {
                currentMessage.content += parsed.text
              }
              
              yield { ...currentMessage }
            } else if (parsed.type === 'done') {
              if (currentMessage) {
                yield currentMessage
              }
              return
            } else if (parsed.type === 'error') {
              throw new Error(parsed.error)
            }
          } catch (error) {
            console.error('Error parsing SSE data:', error)
          }
        }
      }
    }
  }

  /**
   * Send a simple chat message without RAG
   */
  async *simpleChat(message: string): AsyncGenerator<ChatMessage> {
    const response = await fetch(`${API_BASE_URL}/chat/simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to send simple chat message')
    }

    if (!response.body) {
      throw new Error('Response body is null')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let currentMessage: ChatMessage | null = null

    while (true) {
      const { done, value } = await reader.read()
      
      if (done) {
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.trim() === '') continue
        
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          
          try {
            const parsed = JSON.parse(data)

            if (parsed.type === 'text') {
              if (!currentMessage) {
                currentMessage = {
                  role: 'assistant',
                  content: parsed.text,
                }
              } else {
                currentMessage.content += parsed.text
              }
              
              yield { ...currentMessage }
            } else if (parsed.type === 'done') {
              if (currentMessage) {
                yield currentMessage
              }
              return
            } else if (parsed.type === 'error') {
              throw new Error(parsed.error)
            }
          } catch (error) {
            console.error('Error parsing SSE data:', error)
          }
        }
      }
    }
  }
}

export default new ChatAPI()
