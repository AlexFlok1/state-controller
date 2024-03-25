import React, { useEffect, useState } from "react";
import useSegment from "../../../hooks/useSegment";

const Comp1 = () => {
  const segment = useSegment<any>({ name: "test" });
  const [val, setVal] = useState<Record<string, any>>({
    val1: segment.get("val1"),
    val2: segment.get("val2"),
    val3: segment.get("val3"),
  });

  segment.watch({
    segmentKey: ["val1", "val2", "val3.nestedVal"],
    callback: (args) => {
      console.log(args);
      setVal(args);
    },
  });

  return <div>Test Segment{JSON.stringify(val)}</div>;
};

export default Comp1;
