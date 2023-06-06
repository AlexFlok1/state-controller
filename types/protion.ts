import { Action } from './actions';

export type PortionT<T> = {
  name: string;
  portionValue: T;
  actions: Action<any>[];
};
