import { useMemo, useState } from "react";

const useSMCSelector = (portionName: string | void) => {
  const [data, setData] = useState(window.smcMainStore);

  useMemo(() => {}, [portionName]);

  return data;
};

export default useSMCSelector;
