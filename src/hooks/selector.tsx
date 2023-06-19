import { useMemo, useState } from "react";
import { store } from "../models/store";

const useSMCSelector = (portionName: string | void, triggers: string[] | void) => {
  const [data, setData] = useState(store.getValue());

  useMemo(() => {
    if (portionName && triggers)
      triggers.map((trigger) =>
        store.getEvent(`${portionName}.${trigger}`)?.subscribe(() => {
          setData(store.getValueByKey(portionName));
        })
      );
  }, [portionName]);

  return { data };
};

export default useSMCSelector;
