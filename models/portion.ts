import { PortionT } from '../types/protion';

export class Portion<T> {
  private _portion: PortionT<T>;

  constructor(args: PortionT<T>) {
    this._portion = args;
  }

  public get value() {
    return this._portion.defaultValue;
  }
}

// testing out protion class
const a = new Portion({ name: 'test', defaultValue: [], actions: [] });
