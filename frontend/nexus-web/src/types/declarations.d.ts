declare module "phoenix" {
    export class Socket {
      constructor(endpoint: string, options?: any);
      connect(): void;
      disconnect(code?: number, reason?: string): void;
      channel(topic: string, params?: object): Channel;
    }
  
    export class Channel {
      join(): any;
      leave(): void;
      push(event: string, payload: object): any;
      on(event: string, callback: (payload: any) => void): void;
      off(event: string): void;
    }
  }
  