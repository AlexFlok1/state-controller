/*const ev = new Event('test');
const listner = new EventTarget();

setTimeout(() => {
  listner.dispatchEvent(ev);
}, 5000);

listner.addEventListener('test', () => {
  console.log("Omg it's working");
});*/

import { Portion, store } from './models';

type b = {
  test: number;
  test2: number;
};

// testing out protion class
const a = new Portion<{ a: number }>({
  name: 'test',
  portionValue: { a: 1 },
  actions: [
    {
      name: 'test method',
      action: (args: b) => {
        console.log(args);
      },
    },
  ],
});

const res = a.callAction('test method');

if (res) res({ test: 1, test2: 2 });
