import React, { useEffect, useState } from "react";
import useSegment from "../../../hooks/useSegment";

const Comp1 = () => {
  const [val, setVal] = useState("Hello");

  const segment = useSegment<{ val1: string; val2: string }>({ name: "test" });

  useEffect(() => {
    console.log("render");
  }, []);

  segment.watch({
    segmentKey: "val1",
    callback: (val) => {
      console.log(val);
    },
  });

  return <>{val}</>;
};

export default Comp1;
