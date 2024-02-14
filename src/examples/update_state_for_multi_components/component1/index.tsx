import React, { useEffect, useState } from "react";
import useSegment from "../../../hooks/useSegment";

const Comp1 = () => {
  const [val, setVal] = useState("Hello");

  const segment = useSegment<{ val1: string; val2: string; val3: { nestedVal: string } }>({ name: "test" });

  useEffect(() => {
    console.log("render");
  }, []);

  segment.watch({
    segmentKey: "val3.nestedVal",
    callback: (val) => {
      console.log(val);
    },
  });

  return <>{val}</>;
};

export default Comp1;
