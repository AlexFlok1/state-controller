import { EventHandler } from "./event";
import smcStore from "./store";

type UpdateProps<T> = Partial<Record<Extract<Paths<T>, string | number | symbol>, unknown>>;

type WatchParams<T> = {
  segmentKey: Paths<T> | Paths<T>[];
  callback: (args: Record<string, string>) => void;
};

type NonSpecialFunctionProperty<T> = T extends Function ? Omit<T, "caller" | "arguments"> : T;
type Paths<T> = T extends object
  ? {
      [K in keyof NonSpecialFunctionProperty<T>]: `${Exclude<K, symbol>}${
        | ""
        | `.${Paths<NonSpecialFunctionProperty<T>[K]>}`}`;
    }[keyof NonSpecialFunctionProperty<T>]
  : never;

/**=========== */

class Segment<T extends Record<string, unknown>> {
  #name: string;
  #segmentValue: any;
  #watchers: Map<string, EventHandler>;

  constructor(name: string, defaultState: T) {
    this.#name = name;
    this.#segmentValue = this.flattenState(defaultState);
    this.#watchers = new Map();
    this.handleRecordToMainStore();
  }

  //PRIVATE METHODS

  //TODO: this method has a bug when nested more then once
  private flattenState(val: Record<string, unknown>, parent: string = ""): Record<string, unknown> {
    return Object.keys(val).reduce<Record<string, unknown>>((newObj, key) => {
      if (typeof val[key] === "object" && !Array.isArray(val[key])) {
        return {
          ...newObj,
          ...this.flattenState(val[key] as Record<string, unknown>, `${parent ? `${parent}.${key}` : `${key}`}`),
        };
      }
      newObj[`${parent ? `${parent}.` : ""}${key}`] = val[key];
      return newObj;
    }, {});
  }

  private convertNestedKeyToObject(key: string, value: string): Record<string, any> {
    const keys = key.split(".");
    let nestedObj: Record<string, any> = { [keys[keys.length - 1]]: value };
    for (let i = keys.length - 2; i >= 0; i--) {
      nestedObj = { [keys[i]]: nestedObj };
    }
    return nestedObj;
  }

  private deepMergeObjects(...objects: any[]) {
    let mergedObject: any = {};

    for (let key in objects[0]) {
      const nestedMerge = this.deepMergeObjects(
        ...objects.filter((el) => typeof el[key] === "object").map((el) => el[key])
      );
      if (Object.keys(nestedMerge).length > 0) {
        mergedObject[key] = nestedMerge;
      }
    }
    mergedObject = {
      ...objects.reduce((newObj, current) => {
        return { ...newObj, ...current };
      }, {}),
      ...mergedObject,
    };

    return mergedObject;
  }

  private stateToObject(val: Record<string, string>): Record<string, string> {
    const res = Object.keys(val).map((key) => {
      const nestedKeys = key.split(".");
      if (nestedKeys.length > 1) {
        return this.convertNestedKeyToObject(key, val[key]);
      } else {
        return { [key]: val[key] };
      }
    });
    return this.deepMergeObjects(...res) ?? {};
  }

  private handleRecordToMainStore() {
    smcStore.set<T>(this.#name, this);
  }

  private isWatcherExsistAlready(key: string): EventHandler | undefined {
    return this.#watchers.get(key);
  }

  //PUBLIC METHODS

  public get segmentValue() {
    return this.#segmentValue;
  }

  public get(segmentKey: Paths<T>) {
    return this.#segmentValue[segmentKey];
  }

  public update(updateObj: UpdateProps<T>) {
    const flattenedObject = this.flattenState(updateObj);
    Object.keys(flattenedObject).forEach((key) => {
      if (this.#segmentValue[key] !== flattenedObject[key]) {
        this.#segmentValue[key] = flattenedObject[key];
        const watcher = this.#watchers.get(`${this.#name}:${String(key)}`);
        if (watcher) {
          watcher.dispatch();
        }
      }
      this.handleRecordToMainStore();
    });
  }

  public delete(segmentKey: keyof T) {
    delete this.#segmentValue[segmentKey];
    this.handleRecordToMainStore();
  }

  public watch({ segmentKey, callback }: WatchParams<T>) {
    console.log(segmentKey);
    let keys = Array.isArray(segmentKey) ? [...segmentKey] : [segmentKey];
    let watcher: EventHandler | undefined;
    let result: Record<string, any> = {};

    for (const [index, key] of keys.entries()) {
      const moreKeys = Object.keys(this.#segmentValue).filter((nKey) => {
        const regExp = new RegExp(`^${key}\\.\\w+`);
        return regExp.test(nKey);
      });
      if (moreKeys.length > 0) {
        keys.splice(index, 1);
        keys = [...keys, ...moreKeys] as Paths<T>[];
        console.log(keys);
      }
    }

    for (const key of keys) {
      const watcherName = `${this.#name}:${String(key)}`;
      watcher = this.isWatcherExsistAlready(watcherName) ?? new EventHandler({ name: watcherName });
      if (!this.#watchers.has(watcherName)) this.#watchers.set(watcherName, watcher);
      watcher.subscribe(() => {
        result = { ...result, [key]: this.get(key as Paths<T>) };
        callback(this.stateToObject(result as Record<string, string>));
      });
    }
  }
}

export default Segment;
