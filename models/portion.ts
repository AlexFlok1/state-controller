import { PortionT } from '../types/protion';
import { store } from './store';

export class Portion<T> {
  private _portion: PortionT<T>;

  constructor(args: PortionT<T>) {
    this._portion = args;
    store.setValue(args.name, args.defaultValue);
  }

  public get value() {
    return this._portion.defaultValue;
  }

  public get name() {
    return this._portion.name;
  }
}
