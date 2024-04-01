import { useState } from "react";
import useSegment from "../../../hooks/useSegment";
import { Typography } from "@mui/material";

const Comp1 = () => {
  const segment = useSegment<any>({ name: "Segment2" });
  const [val, setVal] = useState<Record<string, any>>({
    val1: segment.get("val1"),
    val2: segment.get("val2"),
  });

  console.log(segment.get("val1"));

  segment.watch({
    segmentKey: ["val1", "val2"],
    callback: (args) => {
      console.log(args);
      setVal(args);
    },
  });

  return (
    <Typography variant="body2">
      Trak Segment 2 data in component 1 <code>{JSON.stringify(val)}</code>
    </Typography>
  );
};

export default Comp1;
