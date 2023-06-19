import React from "react";
import useSMCSelector from "../../../hooks/selector";

const Comp1 = () => {
  const { data } = useSMCSelector("test", ["test method"]);
  return <>{data && <span>Comp1: {data.test}</span>}</>;
};

export default Comp1;
