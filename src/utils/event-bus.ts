type EventMap = {
  textRendered: void; // example event with no payload
  // dataLoaded: { items: string[] }; // example with payload
};

type Callback<T> = (payload: T) => void;

class EventBus<Events extends Record<string, any>> {
  private listeners: {
    [K in keyof Events]?: Callback<Events[K]>[];
  } = {}

  on<K extends keyof Events>(event: K, callback: Callback<Events[K]>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event]!.push(callback)
    return () => this.off(event, callback)
  }

  off<K extends keyof Events>(event: K, callback: Callback<Events[K]>) {
    const callbacks = this.listeners[event]
    if (callbacks) {
      this.listeners[event] = callbacks.filter(cb => cb !== callback)
    }
  }

  emit<K extends keyof Events>(event: K, payload?: Events[K]) {
    this.listeners[event]?.forEach(callback => callback(payload))
  }
}

const eventBus = new EventBus<EventMap>()
export default eventBus
