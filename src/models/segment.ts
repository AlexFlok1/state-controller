import { EventHandler } from "./event";
import smcStore from "./store";

type SignleUpdate<T> = {
  segmentKey: Paths<T>;
  value: T[keyof T];
};

type WatchParams<T> = {
  segmentKey: Paths<T> | Paths<T>[];
  callback: (args: Record<keyof WatchParams<T>["segmentKey"], string>) => void;
};

type WatchParamsForSingleKey<T> = {
  segmentKey: Paths<T>;
  callback: (args: Record<keyof WatchParams<T>["segmentKey"], string>) => void;
};

type UpdateProps<T> = SignleUpdate<T> | SignleUpdate<T>[];

/*
TEST
*/
type NonSpecialFunctionProperty<T> = T extends Function ? Omit<T, "caller" | "arguments"> : T;
type Paths<T> = T extends object
  ? {
      [K in keyof NonSpecialFunctionProperty<T>]: `${Exclude<K, symbol>}${
        | ""
        | `.${Paths<NonSpecialFunctionProperty<T>[K]>}`}`;
    }[keyof NonSpecialFunctionProperty<T>]
  : never;

/**=========== */

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

  private handleWatchForSingleKey({ segmentKey, callback }: WatchParamsForSingleKey<T>): void {
    let watcher: EventHandler | undefined;
    console.log(segmentKey);
    const watcherName = `${this.#name}:${String(segmentKey)}`;
    watcher = this.#watchers.get(watcherName) || new EventHandler({ name: watcherName });
    if (!this.#watchers.has(watcherName)) this.#watchers.set(watcherName, watcher);
    watcher.subscribe(() => {
      callback({ [segmentKey]: this.get(segmentKey) } as unknown as Record<keyof WatchParams<T>["segmentKey"], string>);
    });
  }

  //PUBLIC METHODS

  public get segmentValue() {
    return this.#segmentValue;
  }

  public get(segmentKey: Paths<T>) {
    if (segmentKey.includes(".")) {
      const path = segmentKey.split(".");
      let value: any = this.#segmentValue[path[0] as keyof T];
      path.forEach((_, index) => {
        value = value[path[index + 1]];
      });
      console.log(value);
      return value;
    }

    return this.#segmentValue[segmentKey as keyof T];
  }

  public update(args: UpdateProps<T>) {
    if (this.isSingleSegmentUpdate(args)) {
      if (this.#segmentValue["val1" as keyof T] !== args.value) {
        this.#segmentValue["val1" as keyof T] = args.value;
        this.handleRecordToMainStore();

        const watcher = this.#watchers.get(`${this.#name}:${String(args.segmentKey)}`);
        if (watcher) {
          watcher.dispatch();
        }
      }
    }

    if (this.isArraySegmentUpdate(args)) {
      for (const record of args) {
        if (this.#segmentValue["val1" as keyof T] !== record.value) {
          this.#segmentValue["val1" as keyof T] = record.value;

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
      this.handleWatchForSingleKey({ segmentKey, callback });
    }
  }
}

export default Segment;
