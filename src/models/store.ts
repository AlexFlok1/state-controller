/* SMC 2023 */
import { SetOptions } from "../types/store";
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

  public set<T>(segmentName: string, value: Segment<T extends Record<string, unknown> ? T : never>, options?: SetOptions) {
    this.#store.set(segmentName, value);
  }

  public remove(segmentName: string) {
    this.#store.delete(segmentName);
  }

  //PRIVATE METHODS
  #saveToLocalStorage<T>(name: string, value: Segment<T extends Record<string, unknown> ? T : never>){
    localStorage.setItem(`sms:segemnt:${name}`, JSON.stringify(value))
  }

  #saveToSession<T>(name: string, value: Segment<T extends Record<string, unknown> ? T : never>){
    sessionStorage.setItem(`sms:segemnt:${name}`, JSON.stringify(value))
  }

}

const smcStore = new SMCStore();

export default smcStore;
