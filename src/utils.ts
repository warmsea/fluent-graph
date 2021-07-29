import { identity, merge } from "lodash";

export function css(...classNames: (string | undefined)[]): string {
  return classNames.filter(identity).join(" ");
}

export function mergeConfig<D = any, E = any>(
  defaults: D,
  explicits: E
): D & E {
  return merge({}, defaults, explicits);
}
