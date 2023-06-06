import type { Action } from './actions';

export type PortionT<T, K> = {
  name: string;
  portionValue: T;
  actions: K;
};
