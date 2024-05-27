import Segment from "../../models/segment";
import { Paths } from "../../utilities/types";

//init schema fro the segment

type Segment1 = {
  test1: string;
  test2: string;
};

//Init Segment
const testSegment = new Segment<Segment1>("test segment", { test1: "test1", test2: "test2" });

//init setter
//init generric getter
function segment1Setter(key: Paths<Segment1>, value: Segment1[keyof Segment1]) {
  testSegment.update({ [key]: value });
}

//init generric getter
function segment1Getter(key: Paths<Segment1>): Segment1[keyof Segment1] {
  return testSegment.get(key);
}

//init watcher
const watcher = testSegment.watch;

export { segment1Setter, segment1Getter, watcher };
