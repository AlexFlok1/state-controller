import { useState } from "react";
import useSegment from "../../../hooks/useSegment";
//import { useSegment } from "state-watch/dist";
import { Typography } from "@mui/material";

const Comp1 = () => {
  const segment = useSegment<any>({ name: "Segment2" });
  const [val, setVal] = useState<Record<string, any>>();
  segment?.watch({
    segmentKey: ["val1", "val2"],
    callback: (args) => {
      console.log(args);
      setVal(args);
    },
  });

  return (
    <Typography variant="body2">
      Trak Segment 2 data in component 1 <code>{JSON.stringify(val ?? segment?.getValues(["val1", "val2"]))}</code>
    </Typography>
  );
};

export default Comp1;
