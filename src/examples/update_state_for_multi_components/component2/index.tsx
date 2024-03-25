import React, { useState, useEffect } from "react";
import useSegment from "../../../hooks/useSegment";

const Comp2 = () => {
  const [val, setVal] = useState<Record<string, any>>({});

  const segment = useSegment<{
    val1: string;
    val2: string;
    val3: { nestedVal: string; test: string; secondNested: Record<string, any> };
  }>({ name: "test" });
  const b = useSegment({ name: "test2", defaultValue: { val1: "test1", val2: "test2" } });
  segment.watch({
    segmentKey: ["val3", "val2"],
    callback: (val) => {
      setVal(val);
    },
  });

  const handleTestAction = () => {
    b.update({ val1: "test 3", val2: "test4" });
  };

  return (
    <>
      <div>Test Segment{JSON.stringify(val)}</div>
      <button style={{ width: "200px", padding: "8px", background: "green" }} onClick={handleTestAction}>
        Component2 Update State
      </button>
    </>
  );
};

export default Comp2;
