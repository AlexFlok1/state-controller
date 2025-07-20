/* SMC 2023 */
import { Safe } from "../utilities/types";
import type Segment from "./segment";

class SMCStore {
  #store: Map<string, Segment<any>>;

  constructor() {
    this.#store = new Map();
  }

  //PUBLIC METHODS

  public get<T extends Record<string, unknown>>(segmentName: string): Segment<Safe<T>> | undefined {
    return this.#store.get(segmentName);
  }

  public set<T extends Record<string, unknown>>(segmentName: string, value: Segment<T extends Record<string, unknown> ? T : never>) {
    this.#store.set(segmentName, value);
  }

  public remove(segmentName: string) {
    this.#store.delete(segmentName);
  }

}

const smcStore = new SMCStore();

export default smcStore;
