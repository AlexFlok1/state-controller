import { useMemo, useState } from "react";
import { store } from "../models/store";

export default function useSMCSelector<T = any>(portionName: string | void, triggers: string[] | void) {
  const [data, setData] = useState<T>(portionName ? store.getValueByKey(portionName) : store.getValue());

  useMemo(() => {
    if (portionName && triggers)
      triggers.map((trigger) =>
        store.getEvent(`${portionName}.${trigger}`)?.subscribe(() => {
          setData(store.getValueByKey(portionName));
        })
      );
  }, [portionName]);

  return { data };
}
