import React from "react";
import useSMCSelector from "../../../hooks/selector";

const Comp2 = () => {
  const { data } = useSMCSelector("test", ["test method"]);
  return <>{data && <span>Comp2: {data.test2}</span>}</>;
};

export default Comp2;
