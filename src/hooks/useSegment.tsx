import { useEffect, useState } from "react";
import Segment from "../models/segment";
import smcStore from "../models/store";
import { SegmentOptions } from "../types/store";

type SegementHookProps<T extends Record<string, unknown>> = {
  name: string;
  defaultValue?: T;
  options?: SegmentOptions;
};

/*

    #getFromLocalStorage<T>(name: string): string | null{
    return localStorage.getItem(`sms:segemnt:${name}`)
  }

  #getFromSession<T>(name: string): string | null {
    return sessionStorage.getItem(`sms:segemnt:${name}`)
  }

   let defaultValue: Record<string, unknown>;
    if(this.#options?.saveTo === "localStorage"){
     defaultValue = JSON.parse(this.#getFromLocalStorage<T>(this.#name) ?? "{}")
    }

    if(this.#options?.saveTo === "session"){
      defaultValue = JSON.parse(this.#getFromSession<T>(this.#name) ?? "{}")
    }
*/

type MaybeSegment<T> = Segment<T extends Record<string, unknown> ? T : never> | undefined;

export default function useSegment<T extends Record<string, unknown>>(props: SegementHookProps<T>) {
  const [segment, setSegment] = useState<MaybeSegment<T>>(undefined);

  useEffect(() => {
    let storedSegment = smcStore.get<T>(props.name);

    if (storedSegment && props.defaultValue && Object.keys(storedSegment.getValues()).length === 0) {
      storedSegment.update(props.defaultValue);
    }

    if (!storedSegment) {
      storedSegment = new Segment<T>(props.name, props.defaultValue || ({} as T), props.options);
      if (storedSegment) smcStore.set(props.name, storedSegment as any);
    }

    setSegment(storedSegment);
  }, [props.name, props.defaultValue]);

  return segment;
}
