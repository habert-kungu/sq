type WebSocketMessage = {
  type: string;
  [key: string]: any;
};

type MessageHandler = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private isConnecting = false;

  constructor() {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    // Convert HTTP URL to WebSocket URL
    const wsProtocol = API_URL.startsWith('https') ? 'wss' : 'ws';
    const baseUrl = API_URL.replace(/^https?:\/\//, '').replace('/api/v1', '');
    this.url = `${wsProtocol}://${baseUrl}/ws`;
  }

  /**
   * Connect to WebSocket server
   */
  connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      console.log('[WebSocket] Already connected or connecting');
      return;
    }

    this.isConnecting = true;
    console.log(`[WebSocket] Connecting to ${this.url}...`);

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('[WebSocket] Connected successfully');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        
        // Start ping interval
        this.startPingInterval();
      };

      this.ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          console.log('[WebSocket] Message received:', data.type, data);
          
          // Notify all handlers for this message type
          const handlers = this.messageHandlers.get(data.type);
          if (handlers) {
            handlers.forEach(handler => handler(data));
          }

          // Also notify wildcard handlers
          const wildcardHandlers = this.messageHandlers.get('*');
          if (wildcardHandlers) {
            wildcardHandlers.forEach(handler => handler(data));
          }
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        this.isConnecting = false;
      };

      this.ws.onclose = (event) => {
        console.log('[WebSocket] Connection closed:', event.code, event.reason);
        this.isConnecting = false;
        this.ws = null;

        // Attempt to reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`[WebSocket] Reconnecting in ${this.reconnectDelay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          
          setTimeout(() => {
            this.connect();
          }, this.reconnectDelay);
        } else {
          console.error('[WebSocket] Max reconnect attempts reached');
        }
      };
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      this.isConnecting = false;
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    if (this.ws) {
      console.log('[WebSocket] Disconnecting...');
      this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Send message to server
   */
  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('[WebSocket] Cannot send message: not connected');
    }
  }

  /**
   * Start ping interval to keep connection alive
   */
  private startPingInterval() {
    setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' });
      }
    }, 30000); // Ping every 30 seconds
  }

  /**
   * Subscribe to a message type
   */
  on(messageType: string, handler: MessageHandler) {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, new Set());
    }
    this.messageHandlers.get(messageType)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.off(messageType, handler);
    };
  }

  /**
   * Unsubscribe from a message type
   */
  off(messageType: string, handler: MessageHandler) {
    const handlers = this.messageHandlers.get(messageType);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.messageHandlers.delete(messageType);
      }
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export default new WebSocketService();
