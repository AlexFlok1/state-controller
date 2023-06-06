import { PortionT } from '../types/protion';
import { store } from './store';

export class Portion<T> {
  private _portion: PortionT<T>;

  constructor(args: PortionT<T>) {
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
    return this._portion.actions.find((el) => el.name === name)?.action;
  }
}
