import { EventHandler } from "./event";
import smcStore from "./store";

type SignleUpdate<T> = {
  segmentKey: keyof T;
  value: T[keyof T];
};

type WatchParams<T> = {
  segmentKey: keyof T | (keyof T)[];
  callback: (args: Record<keyof T, string>) => void;
};

type UpdateProps<T> = SignleUpdate<T> | SignleUpdate<T>[];

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

  private isSingleSegmentUpdate<T>(args: UpdateProps<T>): args is SignleUpdate<T> {
    return !Array.isArray(args);
  }

  private isArraySegmentUpdate<T>(args: UpdateProps<T>): args is SignleUpdate<T>[] {
    return Array.isArray(args);
  }

  private isWatcherExsistAlready(key: string): EventHandler | undefined {
    return this.#watchers.get(key);
  }

  private handleNestedKeyValue(key: string) {}

  //PUBLIC METHODS

  public get segmentValue() {
    return this.#segmentValue;
  }

  public get(segmentKey: keyof T) {
    return this.#segmentValue[segmentKey];
  }

  public update(args: UpdateProps<T>) {
    if (this.isSingleSegmentUpdate(args)) {
      if (this.#segmentValue[args.segmentKey] !== args.value) {
        this.#segmentValue[args.segmentKey] = args.value;
        this.handleRecordToMainStore();

        const watcher = this.#watchers.get(`${this.#name}:${String(args.segmentKey)}`);
        if (watcher) {
          watcher.dispatch();
        }
      }
    }

    if (this.isArraySegmentUpdate(args)) {
      for (const record of args) {
        if (this.#segmentValue[record.segmentKey] !== record.value) {
          this.#segmentValue[record.segmentKey] = record.value;

          const watcher = this.#watchers.get(`${this.#name}:${String(record.segmentKey)}`);
          if (watcher) {
            watcher.dispatch();
          }
        }
      }
      this.handleRecordToMainStore();
    }
  }

  public delete(segmentKey: keyof T) {
    delete this.#segmentValue[segmentKey];
    this.handleRecordToMainStore();
  }

  public watch({ segmentKey, callback }: WatchParams<T>) {
    let watcher: EventHandler | undefined;
    if (Array.isArray(segmentKey)) {
      const result: any[] = [];
      for (const key of segmentKey) {
        console.log(key);
        const watcherName = `${this.#name}:${String(key)}`;
        watcher = this.isWatcherExsistAlready(watcherName) ?? new EventHandler({ name: watcherName });
        if (!this.#watchers.has(watcherName)) this.#watchers.set(watcherName, watcher);
        watcher.subscribe(() => {
          result.push({ key, value: this.get(key) });
          callback(
            [...result].reduce((obj, el) => {
              obj[el.key] = el.value;
              return obj;
            }, {})
          );
        });
      }
    } else {
      const watcherName = `${this.#name}:${String(segmentKey)}`;
      watcher = this.#watchers.get(watcherName) || new EventHandler({ name: watcherName });
      if (!this.#watchers.has(watcherName)) this.#watchers.set(watcherName, watcher);
      watcher.subscribe(() => {
        callback({ [segmentKey]: this.get(segmentKey) } as unknown as Record<keyof T, string>);
      });
    }
  }
}

export default Segment;
