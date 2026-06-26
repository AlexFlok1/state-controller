/* SMC 2023 */
import { Safe } from "../utilities/types";
import type Segment from "./segment";

class SMCStore {
  #store: Map<string, Segment<any>>;
  #listeners: Set<() => void>;

  constructor() {
    this.#store = new Map();
    this.#listeners = new Set();
  }

  //PUBLIC METHODS

  public get<T extends Record<string, unknown>>(segmentName: string): Segment<Safe<T>> | undefined {
    return this.#store.get(segmentName);
  }

  public set<T extends Record<string, unknown>>(segmentName: string, value: Segment<T extends Record<string, unknown> ? T : never>) {
    this.#store.set(segmentName, value);
    this.#listeners.forEach((listener) => listener());
  }

  public remove(segmentName: string) {
    this.#store.delete(segmentName);
    this.#listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void): () => void {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  }
}

const smcStore = new SMCStore();

export default smcStore;
