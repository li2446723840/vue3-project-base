export type NumorString = number | string;
export type AnyFunction<T = any> = (...args: any[]) => T;
export type Nullable<T> = T | null;
export type TimeoutHandle = ReturnType<typeof global.setTimeout>;
