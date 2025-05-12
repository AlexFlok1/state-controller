import useSegment from "../hooks/useSegment";
import { SegmentOptions } from "../types/store";

export default function createSegment<T extends Record<string, unknown>>(
    name: string,
    defaultValue: T,
    options?: SegmentOptions
) {
    return useSegment({name, defaultValue, options})
}