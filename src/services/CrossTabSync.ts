import { SEGMENT_STORAGE_PREFIX } from "../constants/storage";
import smcStore from "../models/store";

let initialized = false;

function initCrossTabSync() {
  if (initialized || typeof window === "undefined") {
    return;
  }

  initialized = true;

  window.addEventListener("storage", (event) => {
    if (!event.key?.startsWith(SEGMENT_STORAGE_PREFIX) || event.newValue === null) {
      return;
    }

    const segmentName = event.key.slice(SEGMENT_STORAGE_PREFIX.length);
    const segment = smcStore.get(segmentName);

    if (!segment || segment.persistTo !== "localStorage") {
      return;
    }

    try {
      const flatState = JSON.parse(event.newValue) as Record<string, unknown>;
      segment.hydrateFromFlattenedState(flatState);
    } catch {
      // ignore malformed cross-tab payloads
    }
  });
}

export { initCrossTabSync };
