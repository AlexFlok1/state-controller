/// <reference path="./src/declarations/global.d.ts" />

import { Portion } from "./src/models";
import type { Action } from "./src/types/actions";

type b = {
  test: number;
  test2: number;
};

type ActionsArray = [Action<b>];

// testing out protion class
const a = new Portion<{ a: number }, ActionsArray>({
  name: "test",
  portionValue: { a: 1 },
  actions: [
    {
      name: "test method",
      action: async (args) => {
        console.log(args);
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

const res = a.callAction("test method");

console.log(window.smcMainStore);

if (res) res({ test: 1, test2: 2 });
