import { useEffect, useState } from "react";
import Segment from "../models/segment";
import smcStore from "../models/store";
import { SegmentOptions } from "../types/store";
import {getFromStorage, setToStorage, getSegmentStorage} from "../utilities/useStorage"

type InitSegmentHookProps<T extends Record<string, unknown>> = {
  name: string;
  defaultValue: T;
  options?: SegmentOptions;
}

type ExsisitngSegementHookProps = {
  name: string;
  defaultValue?: never;
  options?: never;
};

type SegementHookProps<T extends Record<string, unknown>> = InitSegmentHookProps<T> | ExsisitngSegementHookProps

type MaybeSegment<T> = Segment<T extends Record<string, unknown> ? T : never> | undefined;

export default function useSegment<T extends Record<string, unknown>>(props: SegementHookProps<T>) {
  const [segment, setSegment] = useState<MaybeSegment<T>>(undefined);
  
  function getSegmentDefaultState(): T | undefined {
    const storage = props.options?.saveTo ? getSegmentStorage(props.options.saveTo) : null;
  
    if (storage) {
      return getFromStorage(storage, props.name) ?? props.defaultValue;
    }
  
    return props.defaultValue;
  }
  
  function saveSegmentValue(value: T) {
    const storage = props.options?.saveTo ? getSegmentStorage(props.options.saveTo) : null;
  
    if (storage) {
      setToStorage(storage, props.name, value);
    }
  }

  useEffect(() => {
    let storedSegment = smcStore.get<T>(props.name);

    if (storedSegment && props.defaultValue && Object.keys(storedSegment.getValues()).length === 0) {
      storedSegment.update(getSegmentDefaultState() ?? {});
      storedSegment.options = props.options ?? {}
      saveSegmentValue(getSegmentDefaultState() ?? {} as T)
    }

    if (!storedSegment) {
      const initial = getSegmentDefaultState();
     
      storedSegment = new Segment<T>(props.name, initial ?? {} as T, props.options ?? {});
      if (storedSegment) {smcStore.set(props.name, storedSegment as any);};
      if(initial){saveSegmentValue(initial)}
    }

    setSegment(storedSegment);
  }, [props.name, props.defaultValue]);


  return segment;
}
