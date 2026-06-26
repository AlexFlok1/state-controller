import smcStore from "./store";

import type { Paths, Safe } from "../utilities/types";
import { SegmentOptions } from "../types/store";
import { SEGMENT_STORAGE_PREFIX } from "../constants/storage";
import { snapshotsEqual } from "../utilities/snapshot";

type UpdateProps<T> = Partial<Record<Extract<Paths<T>, string | number | symbol>, unknown>>;

type WatchParams<T> = {
  segmentKey: Paths<T>[];
  callback: (args: Partial<Safe<T>>) => void;
};

class Segment<T extends Record<string, unknown>> {
  #name: string;
  #segmentValue: any;
  #keyListeners: Map<string, Set<() => void>>;
  #snapshotCache: Map<string, Partial<Safe<T>>>;
  #options?: SegmentOptions;
  #skipPersist = false;

  constructor(name: string, defaultState: T, options?: SegmentOptions) {
    this.#name = name;
    this.#segmentValue = this.flattenState(defaultState) as T;
    this.#keyListeners = new Map();
    this.#snapshotCache = new Map();
    this.handleRecordToMainStore();
    this.#options = options;
  }

  //PRIVATE METHODS
  #setToLocalStorage(name: string, value: Record<string, unknown>) {
    localStorage.setItem(`${SEGMENT_STORAGE_PREFIX}${name}`, JSON.stringify(value));
  }

  #setToSession(name: string, value: Record<string, unknown>) {
    sessionStorage.setItem(`${SEGMENT_STORAGE_PREFIX}${name}`, JSON.stringify(value));
  }

  private flattenState(val: Record<string, unknown>, parent: string = ""): Record<string, unknown> {
    return Object.keys(val).reduce<Record<string, unknown>>((newObj, key) => {
      if (typeof val[key] === "object" && !Array.isArray(val[key]) && val[key] !== null) {
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
    if (!keys.length) {
      return [];
    }
    if (keys.length === 1) {
      return { [keys[0]]: value };
    }
    const topLayerKey = keys.shift()!;
    return { [topLayerKey]: this.convertNestedKeyToObject(keys, value) };
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

  private notifyKeyListeners(key: string) {
    const watcherName = `${this.#name}:${String(key)}`;
    this.#keyListeners.get(watcherName)?.forEach((listener) => listener());
  }

  private handleRecordToMainStore() {
    if (!this.#skipPersist) {
      if (this.#options?.saveTo === "localStorage") {
        this.#setToLocalStorage(this.#name, this.#segmentValue);
      }

      if (this.#options?.saveTo === "sessionStorage") {
        this.#setToSession(this.#name, this.#segmentValue);
      }
    }

    smcStore.set<T>(this.#name, this);
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

  public get segmentName() {
    return this.#name;
  }

  public get persistTo() {
    return this.#options?.saveTo;
  }

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

  public getStableSnapshot(segmentKeys: Paths<T>[]): Partial<Safe<T>> {
    const cacheKey = segmentKeys.join("|");
    const fresh = this.getValues(segmentKeys);
    const cached = this.#snapshotCache.get(cacheKey);

    if (cached && snapshotsEqual(cached as Record<string, unknown>, fresh as Record<string, unknown>)) {
      return cached;
    }

    this.#snapshotCache.set(cacheKey, fresh);
    return fresh;
  }

  public get(segmentKey: Paths<T>) {
    return this.#segmentValue[segmentKey];
  }

  set options(options: SegmentOptions) {
    this.#options = options;
  }

  public subscribe(segmentKeys: Paths<T>[], listener: () => void): () => void {
    const keys = this.handleSegmentKeys(segmentKeys);

    for (const key of keys) {
      const watcherName = `${this.#name}:${String(key)}`;
      if (!this.#keyListeners.has(watcherName)) {
        this.#keyListeners.set(watcherName, new Set());
      }
      this.#keyListeners.get(watcherName)!.add(listener);
    }

    return () => {
      for (const key of keys) {
        const watcherName = `${this.#name}:${String(key)}`;
        this.#keyListeners.get(watcherName)?.delete(listener);
      }
    };
  }

  public update(updateObj: UpdateProps<T>) {
    const flattenedObject = this.flattenState(updateObj);
    Object.keys(flattenedObject).forEach((key) => {
      if (this.#segmentValue[key] !== flattenedObject[key]) {
        this.#segmentValue[key] = flattenedObject[key];
        this.#snapshotCache.clear();
        this.notifyKeyListeners(key);
      }
      this.handleRecordToMainStore();
    });
  }

  public hydrateFromFlattenedState(flatState: Record<string, unknown>) {
    this.#skipPersist = true;
    try {
      const changedKeys: string[] = [];

      Object.keys(flatState).forEach((key) => {
        if (this.#segmentValue[key] !== flatState[key]) {
          this.#segmentValue[key] = flatState[key];
          changedKeys.push(key);
        }
      });

      if (changedKeys.length > 0) {
        this.#snapshotCache.clear();
        smcStore.set<T>(this.#name, this);
        changedKeys.forEach((key) => this.notifyKeyListeners(key));
      }
    } finally {
      this.#skipPersist = false;
    }
  }

  public delete(segmentKey: keyof T) {
    delete this.#segmentValue[segmentKey];
    this.#snapshotCache.clear();
    this.handleRecordToMainStore();
  }

  public watch({ segmentKey, callback }: WatchParams<T>): () => void {
    return this.subscribe(segmentKey, () => {
      callback(this.getValues(segmentKey));
    });
  }
}

export default Segment;
