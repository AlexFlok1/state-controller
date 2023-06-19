// testing out protion class
import { Portion, store } from "../../models";
import type { Action } from "../../types/actions";

type b = {
  test: number;
  test2: number;
};

type PortionDefaultValue = { test: number; test2: number };

type ActionsArray = [Action<b, PortionDefaultValue>];

const a = new Portion<PortionDefaultValue, ActionsArray>({
  name: "test",
  portionValue: { test: 1, test2: 1 },
  actions: [
    {
      name: "test method",
      action: async (args, state) => {
        store.setValue("test", { ...state, test: args.test });
      },
    },
  ],
});

const testAction = a.callAction("test method");

export { testAction };
