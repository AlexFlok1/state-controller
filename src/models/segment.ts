import { EventHandler } from "./event";
import smcStore from "./store";

import type { Paths, Safe } from "../utilities/types";
import { SegmentOptions } from "../types/store";

type UpdateProps<T> = Partial<Record<Extract<Paths<T>, string | number | symbol>, unknown>>;

type WatchParams<T> = {
  segmentKey: Paths<T>[];
  callback: (args: Partial<Safe<T>>) => void;
};

class Segment<T extends Record<string, unknown>> {
  #name: string;
  #segmentValue: any;
  #watchers: Map<string, EventHandler>;
  #options?: SegmentOptions;

  constructor(name: string, defaultState: T, options?: SegmentOptions) {
    this.#name = name;
    this.#segmentValue = this.flattenState(defaultState) as T;
    this.#watchers = new Map();
    this.handleRecordToMainStore();
    this.#options = options
  }


   //PRIVATE METHODS
   #setToLocalStorage<T>(name: string, value: Segment<T extends Record<string, unknown> ? T : never>){
    localStorage.setItem(`sms:segemnt:${name}`, JSON.stringify(value))
  }

  #setToSession<T>(name: string, value: Segment<T extends Record<string, unknown> ? T : never>){
    sessionStorage.setItem(`sms:segemnt:${name}`, JSON.stringify(value))
  }

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

  private convertNestedKeyToObject(keys: string[] = [], value: string): Record<string, any> {
    if(!keys.length){return []}
    if(keys.length === 1){return {[keys[0]]: value}}
    const topLayerKey = keys.shift()!
    return {[topLayerKey]: this.convertNestedKeyToObject(keys, value)}
  }

  private deepMergeObjects(...objects: any[]) {
    let mergedObject: any = {};

    for (let key in objects[0]) {
      const nestedMerge = this.deepMergeObjects(...objects.filter((el) => typeof el[key] === "object").map((el) => el[key]));
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

  private stateToObject(val: Record<Paths<T>, any>): Partial<Safe<T>> {
    const res = Object.keys(val).map((key) => {
      const nestedKeys = key.split(".");
      if (nestedKeys.length > 1) {
        return this.convertNestedKeyToObject(nestedKeys, val[key as Paths<T>]);
      } else {
        return { [key]: val[key as Paths<T>] };
      }
    });
    return this.deepMergeObjects(...res) ?? {};
  }

  private handleRecordToMainStore() {
    if(this.#options?.saveTo === "localStorage"){
      this.#setToLocalStorage<T>(this.#name, this.#segmentValue)
    }

    if(this.#options?.saveTo === "sessionStorage"){
      this.#setToSession<T>(this.#name, this.#segmentValue)
    }

    smcStore.set<T>(this.#name, this);
  }

  private isWatcherExsistAlready(key: string): EventHandler | undefined {
    return this.#watchers.get(key);
  }

  private handleSegmentKeys(keys: Paths<T>[]): Paths<T>[] {
    let result = keys;
    for (const [index, key] of result.entries()) {
      const moreKeys = Object.keys(this.#segmentValue).filter((nKey) => {
        const regExp = new RegExp(`^${key}\\.\\w+`);
        return regExp.test(nKey);
      });
      if (moreKeys.length > 0) {
        result.splice(index, 1);
        result = [...result, ...moreKeys] as Paths<T>[];
      }
    }
    return result;
  }

  //PUBLIC METHODS

  //TODO: add ability to support set of keys

  public getValues(segmentKeys: Paths<T>[] = []) {
    if (segmentKeys.length === 0) {
      return this.stateToObject(this.#segmentValue);
    }

    return this.stateToObject(
      this.handleSegmentKeys(segmentKeys)
        .map((key) => ({ [key]: this.#segmentValue[key] }))
        .reduce((newObj, el) => {
          return { ...newObj, ...el };
        }, {}) as Record<Paths<T>, any>
    );
  }

  public get(segmentKey: Paths<T>) {
    return this.#segmentValue[segmentKey];
  }

  set options(options: SegmentOptions){
    this.#options = options
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
    const keys = this.handleSegmentKeys(segmentKey);
    let watcher: EventHandler | undefined;
    let result: Record<Paths<T>, any> = {} as Record<Paths<T>, any>;
    for (const key of keys) {
      const watcherName = `${this.#name}:${String(key)}`;
      watcher = this.isWatcherExsistAlready(watcherName) ?? new EventHandler({ name: watcherName });
      if (!this.#watchers.has(watcherName)) this.#watchers.set(watcherName, watcher);
      watcher.subscribe(() => {
        result = { ...result, [key]: this.get(key) };
        callback(this.stateToObject(result));
      });
    }
  }
}

export default Segment;
