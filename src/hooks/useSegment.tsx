import { useEffect, useState } from "react";
import Segment from "../models/segment";
import smcStore from "../models/store";
import { SegmentOptions } from "../types/store";
import {TempStorage} from "../services/TempStorage"

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
  const [segment, setSegment] = useState<MaybeSegment<T>>();
  
  function getSegmentDefaultState(): T | undefined {
    if(props.options?.saveTo){
      return TempStorage.instanceOf(props.options.saveTo).get(props.name) ?? props.defaultValue;
    }
    return props.defaultValue;
  }
  
  function saveSegmentValue(value: T) {
    if(props.options?.saveTo){
      TempStorage.instanceOf(props.options.saveTo).set(props.name, value);
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
