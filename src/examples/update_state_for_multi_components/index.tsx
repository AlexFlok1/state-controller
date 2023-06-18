import React from "react";
import Comp1 from "./component1";
import Comp2 from "./component2";

const Example1 = () => {
  return (
    <>
      <Comp1 />
      <br />
      <Comp2 />
      <br />
      <button>Update State</button>
    </>
  );
};

export default Example1;
