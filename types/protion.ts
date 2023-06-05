import { Action } from './actions';

export type PortionT<T> = {
  name: string;
  defaultValue: T;
  actions: Action[];
};
