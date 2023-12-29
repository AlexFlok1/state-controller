import React, { useEffect, useState } from "react";
import Segment from "../models/segment";
import smcStore from "../models/store";

type SegementHookProps<T extends Object> = {
  name: string;
  defaultValue?: T;
};

export default function useSegment<T extends Object>(props: SegementHookProps<T>) {
  const existingSegment = smcStore.get<T>(props.name);
  console.log(existingSegment);
  if (existingSegment) return existingSegment;

  return new Segment<T>(props.name, props.defaultValue || ({} as T));
}
