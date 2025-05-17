declare module "phoenix" {
  export interface Push {
    /**
     * Listen for the server’s reply.
     * @param status usually "ok" or "error"
     * @param callback payload handler
     */
    receive(
      status: "ok" | "error" | "timeout",
      callback: (response: any) => void
    ): Push;
  }

  export class Channel {
    /**
     * Join the channel. Returns a Push so you can call .receive()
     */
    join(): Push;
    /**
     * Leave the channel; also returns a Push you can .receive() on if you want.
     */
    leave(): Push;
    /**
     * Send an event to the server. Returns a Push you can .receive() on.
     */
    push(event: string, payload: object): Push;
    /**
     * Register a callback for an incoming event.
     */
    on(event: string, callback: (payload: any) => void): void;
    /**
     * Unregister a callback.
     */
    off(event: string): void;
  }

  export interface SocketOptions {
    params?: Record<string, any>;
    heartbeatIntervalMs?: number;
    logger?: (kind: string, msg: any, data?: any) => void;
    reconnectAfterMs?: (tries: number) => number;
    longpollerTimeout?: number;
  }

  export class Socket {
    constructor(endpoint: string, opts?: SocketOptions);
    /**
     * Hook into transport-level errors.
     */
    onError(callback: (error: any) => void): void;
    connect(): void;
    disconnect(code?: number, reason?: string): void;
    /**
     * Create or retrieve a channel.
     */
    channel(topic: string, params?: object): Channel;
  }
}
