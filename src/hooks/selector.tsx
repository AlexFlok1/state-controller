import { useMemo, useState } from "react";
import { store } from "../models/store";

const useSMCSelector = (portionName: string | void) => {
  const [data, setData] = useState(store);

  useMemo(() => {
    if (portionName)
      store.getEvent(portionName)?.subscribe(() => {
        setData(store[portionName]);
      });
  }, [portionName]);

  return data;
};

export default useSMCSelector;
