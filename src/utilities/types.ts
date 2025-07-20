type Paths<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${"" | `.${Paths<T[K]>}`}`;
    }[keyof T]
  : never;

  type DeepPartial<T> = T extends object
  ? {
      [K in keyof T]?: DeepPartial<T[K]>;
    }
  : T;

type Maybe<T> = T | null | undefined
type Safe<T> = T extends Record<string, unknown> ? T : never;

export type { Paths, Maybe, DeepPartial, Safe };
