export type Action<T, S> = {
  name: string;
  action: ((args: T, state: S) => void) | ((args: T, state: S) => Promise<void>);
};
