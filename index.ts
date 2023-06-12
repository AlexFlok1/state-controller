import { Portion, store } from './models';
import type { Action } from './types/actions';

type b = {
  test: number;
  test2: number;
};

type ActionsArray = [Action<b>];

// testing out protion class
const a = new Portion<{ a: number }, ActionsArray>({
  name: 'test',
  portionValue: { a: 1 },
  actions: [
    {
      name: 'test method',
      action: (args) => {
        console.log(args);
      },
    },
  ],
});

const res = a.callAction('test method');

if (res) res({ test: 1, test2: 2 });
