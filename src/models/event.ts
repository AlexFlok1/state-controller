import { EventT } from "../types/event";
import { store } from "./store";

class EventHandler {
  private _name: string;
  private _listner: EventTarget;
  private _event: Event;
  private _method: ((args: unknown) => void) | undefined;

  constructor(args: EventT) {
    this._name = args.name;
    this._event = new Event(args.name);
    this._listner = new EventTarget();
  }

  public dispatch() {
    this._listner.dispatchEvent(this._event);
  }

  public subscribe(method: (args: unknown) => void) {
    this._method = method;
    this._listner.addEventListener(this._name, method);
  }

  public unsubscribe() {
    if (this._method) this._listner.removeEventListener(this._name, this._method);
  }
}

export { EventHandler };
