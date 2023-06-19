import React, { useEffect } from "react";
import Comp1 from "./component1";
import Comp2 from "./component2";
import useSMCSelector from "../../hooks/selector";
import { testAction } from "./smcPortions";
import { store } from "../../models";

const Example1 = () => {
  const { data } = useSMCSelector("test", ["test method"]);

  const handleTestAction = () => {
    testAction({ test: Math.random(), test2: Math.random() });
  };

  console.log(data);
  console.log(store);

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
