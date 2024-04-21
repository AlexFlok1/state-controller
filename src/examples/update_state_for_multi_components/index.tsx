//MUI
import { Button, Grid } from "@mui/material";

import Comp1 from "./component1";
import Comp2 from "./component2";
import useSegment from "../../hooks/useSegment";

type Segment2 = { val1: string; val2: string };

const Example1 = (): JSX.Element => {
  const defaultForSegment1 = {
    name: "Segment1",
    defaultValue: {
      val1: "test1",
      val2: "test2",
      val3: { nestedVal: "nested value", test: "cool1", secondNested: { val4: "test4" } },
    },
  };

  const segment1 = useSegment(defaultForSegment1);
  const handleTestAction = () => {
    segment1?.update({
      "val3.nestedVal": "test5",
      "val3.secondNested.val4": "test6",
      val2: "test5",
    });
  };

  const segment2 = useSegment<Segment2>({ name: "Segment2" });

  segment2?.watch({
    segmentKey: ["val1", "val2"],
    callback: (val) => {
      console.log(val);
    },
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Comp1 />
      </Grid>
      <Grid item xs={12}>
        <Comp2 />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" style={{ width: "250px" }} onClick={handleTestAction}>
          Update Segment1
        </Button>
      </Grid>
    </Grid>
  );
};

export default Example1;
