import React from "react";
import useWatchSegment from "../../../hooks/useWatchSegment";
import { Typography } from "@mui/material";

type Segment2 = {
  val1: string;
  val2: string;
};

const Comp1 = () => {
  const val = useWatchSegment<Segment2>({
    name: "Segment2",
    segmentKeys: ["val1", "val2"],
  });

  return (
    <Typography variant="body2">
      Track Segment 2 data in component 1 <code>{JSON.stringify(val)}</code>
    </Typography>
  );
};

export default Comp1;
