import { onMounted, onUnmounted, ref } from 'vue';
import websocketService from '@/services/websocket';

export function useWebSocket() {
  const isConnected = ref(false);

  onMounted(() => {
    websocketService.connect();
    
    // Monitor connection status
    const checkConnection = setInterval(() => {
      isConnected.value = websocketService.isConnected();
    }, 1000);

    onUnmounted(() => {
      clearInterval(checkConnection);
    });
  });

  return {
    isConnected,
    on: websocketService.on.bind(websocketService),
    off: websocketService.off.bind(websocketService),
    send: websocketService.send.bind(websocketService),
  };
}

// Specific composable for document updates
export function useDocumentUpdates(onUpdate: (data: any) => void) {
  const { on } = useWebSocket();

  onMounted(() => {
    const unsubscribeUpdate = on('document_update', onUpdate);
    const unsubscribeProgress = on('processing_progress', onUpdate);
    const unsubscribeError = on('document_error', onUpdate);

    onUnmounted(() => {
      unsubscribeUpdate();
      unsubscribeProgress();
      unsubscribeError();
    });
  });
}

// Specific composable for bulk operation progress
export function useBulkProgress(onProgress: (data: any) => void) {
  const { on } = useWebSocket();

  onMounted(() => {
    const unsubscribe = on('bulk_progress', onProgress);

    onUnmounted(() => {
      unsubscribe();
    });
  });
}
