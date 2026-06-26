import { useCallback, useSyncExternalStore } from "react";
import SMCStore from "../models/store";
import type { Paths, Safe } from "../utilities/types";
import { SegmentOptions } from "../types/store";
import useSegment from "./useSegment";

type InitWatchSegmentProps<T extends Record<string, unknown>> = {
  name: string;
  segmentKeys: Paths<T>[];
  defaultValue: T;
  options?: SegmentOptions;
};

type ExistingWatchSegmentProps<T extends Record<string, unknown>> = {
  name: string;
  segmentKeys: Paths<T>[];
  defaultValue?: never;
  options?: never;
};

type WatchSegmentProps<T extends Record<string, unknown>> =
  | InitWatchSegmentProps<T>
  | ExistingWatchSegmentProps<T>;

const EMPTY_SNAPSHOT = {};

export default function useWatchSegment<T extends Record<string, unknown>>(
  props: WatchSegmentProps<T>
): Partial<Safe<T>> {
  const { name, segmentKeys } = props;
  const keysKey = segmentKeys.join("|");

  if (props.defaultValue !== undefined) {
    useSegment({ name, defaultValue: props.defaultValue, options: props.options });
  } else {
    useSegment({ name });
  }

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const unsubStore = SMCStore.subscribe(onStoreChange);
      const segment = SMCStore.get<T>(name);
      const unsubSegment = segment?.subscribe(segmentKeys, onStoreChange) ?? (() => {});

      return () => {
        unsubStore();
        unsubSegment();
      };
    },
    [name, keysKey]
  );

  const getSnapshot = useCallback((): Partial<Safe<T>> => {
    const segment = SMCStore.get<T>(name);
    if (!segment) {
      return EMPTY_SNAPSHOT as Partial<Safe<T>>;
    }
    return segment.getStableSnapshot(segmentKeys);
  }, [name, keysKey]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
