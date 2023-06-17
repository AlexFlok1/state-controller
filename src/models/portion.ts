import { PortionT } from "../types/protion";
import { store } from "./store";

import type { Action } from "../types/actions";
import { EventHandler } from "./event";

export class Portion<T, K extends Action<any>[]> {
  private _portion: PortionT<T, K>;
  private _events: Map<string, typeof EventHandler>;

  constructor(args: PortionT<T, K>) {
    this._portion = args;
    this._events = new Map<string, typeof EventHandler>();
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
    const indx = this._portion.actions.findIndex((el) => el.name === name);
    if (indx >= 0)
      return (args: K[typeof indx] extends Action<infer B> ? B : never) => {
        const event = new EventHandler({ name });
        event.dispatch();
        return this._portion.actions[indx].action(args);
      };
    else {
      throw new Error("Action not found");
    }
  }
}
