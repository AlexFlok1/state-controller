/* SMC 2023 */
import { Safe } from "../utilities/types";
import type Segment from "./segment";

class SMCStore {
  static #store: Map<string, Segment<any>>;
  static #listeners: Set<() => void>;

  static init(){
    this.#store = new Map();
    this.#listeners = new Set();
  }

  //PUBLIC METHODS

  public static get<T extends Record<string, unknown>>(segmentName: string): Segment<Safe<T>> | undefined {
    return this.#store.get(segmentName);
  }

  public static set<T extends Record<string, unknown>>(segmentName: string, value: Segment<T extends Record<string, unknown> ? T : never>) {
    this.#store.set(segmentName, value);
    this.#listeners.forEach((listener) => listener());
  }

  public static remove(segmentName: string) {
    this.#store.delete(segmentName);
    this.#listeners.forEach((listener) => listener());
  }

  public static subscribe(listener: () => void): () => void {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  }
}

SMCStore.init();

export default SMCStore;
