import React, { useEffect } from "react";
import { useState } from "react";
import useSegment from "../../../hooks/useSegment";
import { Button, Typography } from "@mui/material";
import { whatchFor, segment1Setter, getAll } from "../../test_segment_using_class/segment";

const Comp3 = () => {
  const [data, setData] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    whatchFor({
      segmentKey: ["test1"],
      callback: (val) => {
        setData({ ...(data ?? {}), ...val });
      },
    });
  }, []);

  function handleTestAction() {
    segment1Setter("test1", "Updated test 1 with a new value");
  }

  return (
    <>
      <Typography variant="body2">
        Trak "Class test segment" data in component 3 <code>{JSON.stringify(data ?? getAll())}</code>
      </Typography>
      <Button variant="contained" style={{ width: "250px" }} onClick={handleTestAction}>
        Update Segment3
      </Button>
    </>
  );
};

export default Comp3;
