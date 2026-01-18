import { ref, onMounted } from 'vue';

// Define the structure of a single chat history item
export interface ChatHistoryItem {
  _id: string;
  userId: string;
  message: string;
  response: string;
  sources: any[]; 
  createdAt: string;
  updatedAt: string;
}

/**
 * Composable for fetching and managing chat history.
 */
export function useChatHistory() {
  const history = ref<ChatHistoryItem[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Fetches the chat history from the API.
   */
  const fetchHistory = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      // NOTE: Using a hardcoded URL for now. This should be replaced with a
      // configurable environment variable for the API base URL.
      const response = await fetch('http://localhost:3000/api/v1/history');
      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }
      const data = await response.json();
      history.value = data.sort((a: ChatHistoryItem, b: ChatHistoryItem) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (e: any) {
      error.value = e.message || 'An unknown error occurred';
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch history immediately when the composable is used
  onMounted(fetchHistory);

  return {
    history,
    isLoading,
    error,
    fetchHistory, // Expose fetchHistory to allow manual refreshing
  };
}
