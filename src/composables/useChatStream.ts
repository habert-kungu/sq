import { ref } from 'vue';

export interface ChatSource {
  title: string;
  category?: string;
  score?: number;
}

export interface ChatOptions {
  category?: string | null;
  tags?: string[] | null;
  searchLimit?: number;
  contextChunksPerDoc?: number;
  model?: string;
  endpoint?: string;
}

export function useChatStream() {
  const text = ref('');
  const sources = ref<ChatSource[]>([]);
  const isStreaming = ref(false);
  const error = ref<string | null>(null);
  const controllerRef = ref<AbortController | null>(null);

  async function send(message: string, opts: ChatOptions = {}) {
    error.value = null;
    text.value = '';
    sources.value = [];
    isStreaming.value = true;

    const endpoint = opts.endpoint || 'http://localhost:3000/api/v1/chat';
    const body = {
      message,
      category: opts.category ?? null,
      tags: opts.tags ?? null,
      searchLimit: opts.searchLimit ?? 5,
      contextChunksPerDoc: opts.contextChunksPerDoc ?? 2,
      model: opts.model,
    };

    const controller = new AbortController();
    controllerRef.value = controller;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx;
        while ((idx = buffer.indexOf('\n\n')) !== -1) {
          const eventBlock = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);

          const lines = eventBlock.split(/\r?\n/);
          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const jsonStr = line.slice(5).trim();
            if (!jsonStr) continue;
            try {
              const data = JSON.parse(jsonStr);
              if (data.type === 'sources') {
                sources.value = (data.sources || []).map((s: any) => ({
                  title: s.title,
                  category: s.category,
                  score: s.score,
                }));
              } else if (data.type === 'text-delta' && data.textDelta) {
                text.value += data.textDelta;
              } else if (data.type === 'finish' || data.type === 'done') {
                // no-op; end handled outside
              } else if (data.textDelta) {
                text.value += data.textDelta;
              }
            } catch {
              text.value += jsonStr + '\n';
            }
          }
        }
      }
    } catch (e: any) {
      error.value = e?.message || 'Streaming error';
    } finally {
      isStreaming.value = false;
      controllerRef.value = null;
    }
  }

  function cancel() {
    if (controllerRef.value) {
      controllerRef.value.abort();
      controllerRef.value = null;
      isStreaming.value = false;
    }
  }

  return { text, sources, isStreaming, error, send, cancel };
}
