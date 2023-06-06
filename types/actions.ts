export type Action<T> = {
  name: string;
  action: ((args: T) => void) | ((args: T) => Promise<void>);
};
