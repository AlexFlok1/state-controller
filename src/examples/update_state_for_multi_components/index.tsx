import React, { useEffect } from "react";
import Comp1 from "./component1";
import Comp2 from "./component2";
import { testAction } from "./smcPortions";

const Example1 = () => {
  const handleTestAction = () => {
    testAction({ test: Math.random(), test2: Math.random() });
  };
  return (
    <>
      <Comp1 />
      <br />
      <Comp2 />
      <br />
      <button onClick={handleTestAction}>Update State</button>
    </>
  );
};

export default Example1;
