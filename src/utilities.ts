import { HTMLAttributes } from "react";

export type HTMLFreeAttributes<T> = HTMLAttributes<T> & Record<string, unknown>;
