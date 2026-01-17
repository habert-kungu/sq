const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export interface KnowledgeDocument {
  _id: string
  title: string
  description?: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  category: string
  tags: string[]
  vectorized: boolean
  status: 'pending' | 'processing' | 'completed' | 'failed'
  pageCount?: number
  views: number
  downloads: number
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse {
  success: boolean
  data: KnowledgeDocument[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SearchResult extends KnowledgeDocument {
  score: number
  matchedChunks: Array<{
    text: string
    score: number
    chunkIndex: number
  }>
}

export interface Stats {
  total: number
  byCategory: Record<string, number>
  byStatus: Record<string, number>
  recentUploads: KnowledgeDocument[]
}

class KnowledgeAPI {
  /**
   * Upload a document
   */
  async uploadDocument(file: File, metadata: {
    title?: string
    description?: string
    category: string
    tags?: string[]
  }): Promise<KnowledgeDocument> {
    const formData = new FormData()
    formData.append('file', file)
    if (metadata.title) formData.append('title', metadata.title)
    if (metadata.description) formData.append('description', metadata.description)
    formData.append('category', metadata.category)
    if (metadata.tags) formData.append('tags', JSON.stringify(metadata.tags))

    const response = await fetch(`${API_BASE_URL}/knowledge/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to upload document')
    }

    const result = await response.json()
    return result.data
  }

  /**
   * Get all documents with pagination and filters
   */
  async getDocuments(params?: {
    page?: number
    limit?: number
    category?: string
    tags?: string[]
    status?: string
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.category) queryParams.append('category', params.category)
    if (params?.tags) queryParams.append('tags', params.tags.join(','))
    if (params?.status) queryParams.append('status', params.status)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder)

    const response = await fetch(`${API_BASE_URL}/knowledge?${queryParams}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch documents')
    }

    return await response.json()
  }

  /**
   * Get document by ID
   */
  async getDocumentById(id: string): Promise<KnowledgeDocument> {
    const response = await fetch(`${API_BASE_URL}/knowledge/${id}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch document')
    }

    const result = await response.json()
    return result.data
  }

  /**
   * Update document metadata
   */
  async updateDocument(id: string, updates: {
    title?: string
    description?: string
    category?: string
    tags?: string[]
  }): Promise<KnowledgeDocument> {
    const response = await fetch(`${API_BASE_URL}/knowledge/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update document')
    }

    const result = await response.json()
    return result.data
  }

  /**
   * Delete document
   */
  async deleteDocument(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/knowledge/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete document')
    }
  }

  /**
   * Bulk delete documents
   */
  async bulkDeleteDocuments(ids: string[]): Promise<{ success: number; failed: number }> {
    const response = await fetch(`${API_BASE_URL}/knowledge/bulk-delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to bulk delete documents')
    }

    const result = await response.json()
    return result.data
  }

  /**
   * Semantic search
   */
  async semanticSearch(query: string, options?: {
    limit?: number
    category?: string
    tags?: string[]
  }): Promise<SearchResult[]> {
    const queryParams = new URLSearchParams({ query })
    
    if (options?.limit) queryParams.append('limit', options.limit.toString())
    if (options?.category) queryParams.append('category', options.category)
    if (options?.tags) queryParams.append('tags', options.tags.join(','))

    const response = await fetch(`${API_BASE_URL}/knowledge/search?${queryParams}`)
    
    if (!response.ok) {
      throw new Error('Failed to perform search')
    }

    const result = await response.json()
    return result.data
  }

  /**
   * Get statistics
   */
  async getStats(): Promise<Stats> {
    const response = await fetch(`${API_BASE_URL}/knowledge/stats`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch statistics')
    }

    const result = await response.json()
    return result.data
  }

  /**
   * Get download URL
   */
  async getDownloadUrl(id: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/knowledge/${id}/download`)
    
    if (!response.ok) {
      throw new Error('Failed to generate download URL')
    }

    const result = await response.json()
    return result.data.downloadUrl
  }

  /**
   * Get available categories
   */
  async getCategories(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/knowledge/categories`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }

    const result = await response.json()
    return result.data
  }
}

export const knowledgeAPI = new KnowledgeAPI()
