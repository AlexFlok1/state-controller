import React from "react";
import useSMCSelector from "../../../hooks/selector";
import { PortionDefaultValue } from "../smcPortions";

const Comp1 = () => {
  const { data } = useSMCSelector<PortionDefaultValue>("test", ["test method"]);
  return <>{data && <span>Comp1: {data.test}</span>}</>;
};

export default Comp1;
