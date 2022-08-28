import { WithData } from "@warmsea/h";
import merge from "lodash/merge";
import { HTMLAttributes } from "react";

export type DivAttributes = WithData<HTMLAttributes<HTMLDivElement>>;

export function mergeConfig<D = Record<string, unknown>, E = Record<string, unknown>>(
  defaults: D,
  explicits: E
): D & E {
  return merge({}, defaults, explicits);
}
