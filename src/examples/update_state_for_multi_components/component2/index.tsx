import { useState } from "react";
import useSegment from "../../../hooks/useSegment";
import { Button, Typography } from "@mui/material";

const Comp2 = () => {
  const [val, setVal] = useState<Record<string, any>>();

  const segment1 = useSegment<{
    val1: string;
    val2: string;
    val3: { nestedVal: string; test: string; secondNested: Record<string, any> };
  }>({ name: "Segment1" });
  const segment2 = useSegment({ name: "Segment2", defaultValue: { val1: "test1", val2: "test2" } });
  segment1?.watch({
    segmentKey: ["val3", "val2"],
    callback: (val) => {
      console.log(val);
      setVal(val);
    },
  });

  const handleTestAction = () => {
    segment2?.update({ val1: "test 3", val2: "test4" });
  };

  console.log(segment1?.segmentValue);

  return (
    <>
      <Typography variant="body2">
        Trak Segment 1 data in component 2 <code>{JSON.stringify(val ?? segment1?.segmentValue)}</code>
      </Typography>
      <Button variant="contained" style={{ width: "250px" }} onClick={handleTestAction}>
        Update Segment2
      </Button>
    </>
  );
};

export default Comp2;
