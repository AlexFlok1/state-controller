import { EventHandler } from "./event";
import smcStore from "./store";

class Segment<T extends Object> {
  #name: string;
  #segmentValue: T;
  #watchers: Map<string, EventHandler>;

  constructor(name: string, defaultState: T) {
    this.#name = name;
    this.#segmentValue = defaultState;
    this.#watchers = new Map();
    this.handleRecordToMainStore();
  }

  //PRIVATE METHODS

  private handleRecordToMainStore() {
    smcStore.set<T>(this.#name, this);
  }

  //PUBLIC METHODS

  public get segmentValue() {
    return this.#segmentValue;
  }

  public get(segmentKey: keyof T) {
    return this.#segmentValue[segmentKey];
  }

  public update(segmentKey: keyof T, value: T[keyof T]) {
    if (this.#segmentValue[segmentKey] !== value) {
      this.#segmentValue[segmentKey] = value;
      this.handleRecordToMainStore();

      const watcher = this.#watchers.get(`${this.#name}:${String(segmentKey)}`);
      if (watcher) {
        watcher.dispatch();
      }
    }
  }

  public delete(segmentKey: keyof T) {
    delete this.#segmentValue[segmentKey];
    this.handleRecordToMainStore();
  }

  public watch(segmentKey: keyof T, callback: (value: T[keyof T]) => { value: T[keyof T] } | void) {
    const watcherName = `${this.#name}:${String(segmentKey)}`;

    let watcher = this.#watchers.get(watcherName) || new EventHandler({ name: watcherName });
    if (!this.#watchers.has(watcherName)) this.#watchers.set(watcherName, watcher);
    console.log(this.#watchers);
    watcher.subscribe(() => {
      callback(this.get(segmentKey));
    });
  }
}

export default Segment;
