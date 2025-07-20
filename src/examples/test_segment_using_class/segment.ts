import Segment from "../../models/segment";
//import Segment from "state-watch/dist/models/segment";
import { Paths } from "../../utilities/types";

//init schema fro the segment

export type Segment1 = {
  test1: string;
  test2: string;
};

//Init Segment
const testSegment = new Segment<Segment1>( "test segment", { test1: "test1", test2: "test2" });

//get all values
function getAll() {
  return testSegment.getValues();
}

//init generric setter
function segment1Setter(key: Paths<Segment1>, value: Segment1[keyof Segment1]) {
  testSegment.update({ [key]: value });
}

//init generric getter
function segment1Getter(key: Paths<Segment1>): Segment1[keyof Segment1] {
  return testSegment.get(key);
}

//init watcher for spesific value
function whatchFor(params: Parameters<typeof testSegment.watch>[0]) {
  testSegment.watch(params);
}

export { segment1Setter, segment1Getter, whatchFor, getAll };
