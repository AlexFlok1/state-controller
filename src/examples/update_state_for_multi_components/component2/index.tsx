import React from "react";
import useSegment from "../../../hooks/useSegment";
import useWatchSegment from "../../../hooks/useWatchSegment";
import { Button, Typography } from "@mui/material";

type Segment1 = {
  val1: string;
  val2: string;
  val3: { nestedVal: string; test: string; secondNested: { val4: string } };
};

const Comp2 = () => {
  const val = useWatchSegment<Segment1>({
    name: "Segment1",
    segmentKeys: ["val3.nestedVal", "val2", "val3.secondNested.val4"],
  });

  const segment2 = useSegment({
    name: "Segment2",
    defaultValue: { val1: "test1", val2: "test2" },
    options: { saveTo: "localStorage" },
  });

  const handleTestAction = () => {
    segment2?.update({ val1: "test 3", val2: "test4" });
  };

  return (
    <>
      <Typography variant="body2">
        Track Segment 1 data in component 2 <code>{JSON.stringify(val)}</code>
      </Typography>
      <Button variant="contained" style={{ width: "250px" }} onClick={handleTestAction}>
        Update Segment2 (syncs across tabs)
      </Button>
    </>
  );
};

export default Comp2;
