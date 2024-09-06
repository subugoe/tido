type EventMap = {
  [key: string]: any; // Define the event names as keys and their associated payloads as values
};

type EventCallback<T = any> = (payload: T) => void;

type TextEvents = {
  'click': { target: EventTarget };
};

class TextEventBus<Events extends TextEvents> {
  private events: { [K in keyof Events]?: EventCallback<Events[K]>[] } = {};

  // Subscribe to an event
  on<K extends keyof Events>(event: K, callback: EventCallback<Events[K]>): () => void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event]!.push(callback);
    return () => this.off(event, callback);
  }

  // Unsubscribe from an event
  off<K extends keyof Events>(event: K, callback: EventCallback<Events[K]>): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event]!.filter(cb => cb !== callback);
  }

  // Emit an event
  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    if (!this.events[event]) return;
    this.events[event]!.forEach(callback => callback(payload));
  }
}

export default new TextEventBus()
