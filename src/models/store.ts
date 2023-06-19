import { EventHandler } from "./event";

class Store {
  private _store: Record<string, any>;
  private _events: Map<string, EventHandler>;
  constructor() {
    this._store = {};
    this._events = new Map<string, EventHandler>();
  }

  public setValue<T>(key: string, value: T) {
    this._store[key] = value;
  }

  public getValueByKey(key: keyof typeof this._store) {
    return this._store[key];
  }

  public addEvent = (key: string, value: EventHandler) => {
    this._events.set(key, value);
  };

  public removeEvent = (key: string) => {
    this._events.delete(key);
  };

  public getEvent = (key: string) => this._events.get(key);

  public getValue() {
    return this._store;
  }
}

const store = new Store();

export { store };
