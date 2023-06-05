export type Action = {
  name: string;
  action: ((args: unknown) => void) | ((args: unknown) => Promise<void>);
};
