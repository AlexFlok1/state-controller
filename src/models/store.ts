/* SMC 2023 */
import Segment from "./segment";

class SMCStore {
  #store: Map<string, Segment<any>>;

  constructor() {
    this.#store = new Map();
  }

  //PUBLIC METHODS

  public get<T>(segmentName: string): Segment<T extends Object ? T : never> | undefined {
    return this.#store.get(segmentName);
  }

  public set<T>(segmentName: string, value: Segment<any>) {
    this.#store.set(segmentName, value);
  }

  public remove(segmentName: string) {
    this.#store.delete(segmentName);
  }
}

const smcStore = new SMCStore();

export default smcStore;
