import { PortionT } from '../types/protion';
import { store } from './store';

import type { Action } from '../types/actions';

export class Portion<T, K extends Action<any>[]> {
  private _portion: PortionT<T, K>;

  constructor(args: PortionT<T, K>) {
    this._portion = args;
    try {
      store.setValue(args.name, args.portionValue);
    } catch (err: unknown) {
      console.error(err);
    }
  }

  public get value() {
    return this._portion.portionValue;
  }

  public get name() {
    return this._portion.name;
  }

  public callAction(name: string) {
    const action = this._portion.actions.find((el) => el.name === name)?.action;
    if (action) {
      return (...args: Parameters<typeof action>) =>
        action.call(this._portion, ...args);
    }
    return undefined;
  }
}
