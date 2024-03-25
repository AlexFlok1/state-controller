import React, { useEffect } from "react";
import Comp1 from "./component1";
import Comp2 from "./component2";
import useSegment from "../../hooks/useSegment";

const Example1 = () => {
  const a = useSegment({
    name: "test",
    defaultValue: {
      val1: "test1",
      val2: "test2",
      val3: { nestedVal: "nested value", test: "cool1", secondNested: { val4: "test4" } },
    },
  });
  const handleTestAction = () => {
    a.update({
      val3: { nestedVal: "cool1", test: "cool3" },
      "val3.nestedVal": "test5",
      val2: "test5",
    });
  };

  const segment = useSegment<{ val1: string; val2: string }>({ name: "test2" });

  segment.watch({
    segmentKey: ["val1", "val2"],
    callback: (val) => {
      console.log(val);
    },
  });

  return (
    <>
      <Comp1 />
      <br />
      <Comp2 />
      <br />
      <button
        style={{ width: "250px", padding: "8px", background: "green", marginTop: "5px" }}
        onClick={handleTestAction}
      >
        Main Component Update State
      </button>
    </>
  );
};

export default Example1;
