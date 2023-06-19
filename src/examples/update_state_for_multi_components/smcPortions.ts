// testing out protion class
import { Portion, store } from "../../models";
import type { Action } from "../../types/actions";

type b = {
  test: number;
  test2: number;
};

type ActionsArray = [Action<b>];

const a = new Portion<{ test: number; test2: number }, ActionsArray>({
  name: "test",
  portionValue: { test: 1, test2: 1 },
  actions: [
    {
      name: "test method",
      action: async (args) => {
        store.setValue("test", args);
      },
    },
  ],
});

const b = new Portion<{ b: number }, ActionsArray>({
  name: "test2",
  portionValue: { b: 1 },
  actions: [
    {
      name: "test method",
      action: async (args) => {
        console.log(args);
      },
    },
  ],
});

const testAction = a.callAction("test method");

export { testAction };
