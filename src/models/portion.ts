import { PortionT } from "../types/protion";
import { store } from "./store";

import type { Action } from "../types/actions";
import { EventHandler } from "./event";

export class Portion<T, K extends Action<any, T>[]> {
  private _portion: PortionT<T, K>;

  constructor(args: PortionT<T, K>) {
    this._portion = args;
    store.setValue(args.name, args.portionValue);
    args.actions.map((action) =>
      store.addEvent(`${args.name}.${action.name}`, new EventHandler({ name: action.name }))
    );
  }

  public get value() {
    return this._portion.portionValue;
  }

  public get name() {
    return this._portion.name;
  }

  public callAction(name: string) {
    const indx = this._portion.actions.findIndex((el) => el.name === name);
    if (indx >= 0)
      return (args: K[typeof indx] extends Action<infer B, T> ? B : never) => {
        const state = store.getValueByKey(this._portion.name) as T;
        store.getEvent(`${this._portion.name}.${name}`)?.dispatch();
        return this._portion.actions[indx].action(args, state);
      };
    else {
      throw new Error("Action not found");
    }
  }
}
