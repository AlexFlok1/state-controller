import { useState } from "react";
import useSegment from "../../../hooks/useSegment";
import { Button, Typography } from "@mui/material";

const Comp2 = () => {
  const [val, setVal] = useState<Record<string, any>>({});

  const segment = useSegment<{
    val1: string;
    val2: string;
    val3: { nestedVal: string; test: string; secondNested: Record<string, any> };
  }>({ name: "Segment1" });
  const b = useSegment({ name: "Segment2", defaultValue: { val1: "test1", val2: "test2" } });
  segment.watch({
    segmentKey: ["val3", "val2"],
    callback: (val) => {
      setVal(val);
    },
  });

  const handleTestAction = () => {
    b.update({ val1: "test 3", val2: "test4" });
  };

  return (
    <>
      <Typography variant="body2">
        Trak Segment 1 data in component 2 <code>{JSON.stringify(val)}</code>
      </Typography>
      <Button variant="contained" style={{ width: "250px" }} onClick={handleTestAction}>
        Update Segment2
      </Button>
    </>
  );
};

export default Comp2;
