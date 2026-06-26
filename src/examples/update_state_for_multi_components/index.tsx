import { Button, Grid, Typography } from "@mui/material";

import Comp1 from "./component1";
import Comp2 from "./component2";
import useSegment from "../../hooks/useSegment";
import Comp3 from "./component3";

type Segment2 = { val1: string; val2: string };

const Example1 = (): JSX.Element => {
  const segment1 = useSegment({
    name: "Segment1",
    defaultValue: {
      val1: "test1",
      val2: "test2",
      val3: { nestedVal: "nested value", test: "cool1", secondNested: { val4: "test4" } },
    },
  });

  const handleTestAction = () => {
    segment1?.update({
      "val3.nestedVal": "test5",
      "val3.secondNested.val4": "test6",
      val2: "test5",
    });
  };

  useSegment<Segment2>({
    name: "Segment2",
    defaultValue: { val1: "test1", val2: "test2" },
    options: { saveTo: "localStorage" },
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="caption" color="text.secondary">
          Segment2 uses localStorage — open this page in two tabs and click &quot;Update Segment2&quot; to see cross-tab sync.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Comp1 />
      </Grid>
      <Grid item xs={12}>
        <Comp2 />
      </Grid>
      <Grid item xs={12}>
        <Comp3 />
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
