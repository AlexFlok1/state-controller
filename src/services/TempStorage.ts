import { SEGMENT_STORAGE_PREFIX } from "../constants/storage";

export class TempStorage {
  private static storage: Storage;

  public static instanceOf(variant: "localStorage" | "sessionStorage") {
    this.storage = variant === "localStorage" ? localStorage : sessionStorage;
    return TempStorage;
  }

  public static get(name: string) {
    const item = this.storage.getItem(`${SEGMENT_STORAGE_PREFIX}${name}`);
    return item ? JSON.parse(item) : null;
  }

  public static set(name: string, value: Record<string, any> = {}) {
    this.storage.setItem(`${SEGMENT_STORAGE_PREFIX}${name}`, JSON.stringify(value));
  }
}
