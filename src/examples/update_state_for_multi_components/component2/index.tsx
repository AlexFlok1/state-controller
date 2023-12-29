import React, { useState, useEffect } from "react";
import useSegment from "../../../hooks/useSegment";

const Comp2 = () => {
  const [val, setVal] = useState("Hello");

  console.log("render2");
  const segment = useSegment<{ val1: string; val2: string }>({ name: "test" });
  const b = useSegment({ name: "test2", defaultValue: { val1: "test1", val2: "test2" } });
  segment.watch("val1", (value) => {
    setVal(value);
  });

  const handleTestAction = () => {
    b.update("val2", "updated_test");
  };

  return (
    <>
      {val}
      <button onClick={handleTestAction}> Component2 Update State</button>
    </>
  );
};

export default Comp2;
