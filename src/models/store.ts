/* SMC 2023 */
import type Segment from "./segment";

class SMCStore {
  #store: Map<string, Segment<Record<string, unknown>>>;

  constructor() {
    this.#store = new Map();
  }

  //PUBLIC METHODS

  public get<T>(segmentName: string): Segment<T extends Record<string, unknown> ? T : never> | undefined {
    return this.#store.get(segmentName);
  }

  public set<T>(segmentName: string, value: Segment<T extends Record<string, unknown> ? T : never>) {

    this.#store.set(segmentName, value);
  }

  public remove(segmentName: string) {
    this.#store.delete(segmentName);
  }

}

const smcStore = new SMCStore();

export default smcStore;
