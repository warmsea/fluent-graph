import { HTMLAttributes } from "react";

export type WithData<T> = T & Record<`data-${string}`, string | number | boolean>;

export type DivAttributes = WithData<HTMLAttributes<HTMLDivElement>>;
