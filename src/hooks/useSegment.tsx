import { useEffect, useState } from "react";
import Segment from "../models/segment";
import smcStore from "../models/store";

type SegementHookProps<T extends Record<string, unknown>> = {
  name: string;
  defaultValue?: T;
};

type MaybeSegment<T> = Segment<T extends Record<string, unknown> ? T : never> | undefined;

export default function useSegment<T extends Record<string, unknown>>(props: SegementHookProps<T>) {
  const [segment, setSegment] = useState<MaybeSegment<T>>(undefined);

  useEffect(() => {
    let storedSegment = smcStore.get<T>(props.name);

    if (storedSegment && props.defaultValue && Object.keys(storedSegment.getValues()).length === 0) {
      storedSegment.update(props.defaultValue);
    }

    if (!storedSegment) {
      storedSegment = new Segment<T>(props.name, props.defaultValue || ({} as T));
      if (storedSegment) smcStore.set(props.name, storedSegment as any);
    }

    setSegment(storedSegment);
  }, [props.name, props.defaultValue]);

  return segment;
}
