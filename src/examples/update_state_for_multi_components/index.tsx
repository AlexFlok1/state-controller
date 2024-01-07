import React, { useEffect } from "react";
import Comp1 from "./component1";
import Comp2 from "./component2";
import useSegment from "../../hooks/useSegment";

const Example1 = () => {
  const a = useSegment({ name: "test", defaultValue: { val1: "test1", val2: "test2" } });
  const handleTestAction = () => {
    a.update({ segmentKey: "val1", value: "updated_value" });
  };

  const segment = useSegment<{ val1: string; val2: string }>({ name: "test2" });

  segment.watch(["val1", "val2"], (value) => {
    console.log(value);
  });

  return (
    <>
      <Comp1 />
      <br />
      <Comp2 />
      <br />
      <button onClick={handleTestAction}>Main Component Update State</button>
    </>
  );
};

export default Example1;
