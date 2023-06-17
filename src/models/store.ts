/// <reference path="../modules/global.d.ts" />
class Store {
  private _store: typeof window.smcMainStore;
  constructor() {
    this._store = {};
  }

  public setValue<T>(key: string, value: T) {
    if (this._store[key]) throw new Error(`The keys: ${key} already exists`);

    this._store[key] = value;
    if (typeof window !== 'undefined') window.smcMainStore = this._store;
  }

  public getValueByKey(key: keyof typeof window.smcMainStore) {
    return this._store[key];
  }

  public getValue() {
    return this._store;
  }
}

const store = new Store();

export { store };
