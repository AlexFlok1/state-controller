const ev = new Event('test');
const listner = new EventTarget();

setTimeout(() => {
  listner.dispatchEvent(ev);
}, 5000);

listner.addEventListener('test', () => {
  console.log("Omg it's working");
});
