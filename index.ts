/*const ev = new Event('test');
const listner = new EventTarget();

setTimeout(() => {
  listner.dispatchEvent(ev);
}, 5000);

listner.addEventListener('test', () => {
  console.log("Omg it's working");
});*/

import { Portion, store } from './models';

// testing out protion class
const a = new Portion({ name: 'test', defaultValue: [{ a: 1 }], actions: [] });
const b = new Portion({ name: 'test2', defaultValue: [{ b: 1 }], actions: [] });

console.log(store.getValue());
