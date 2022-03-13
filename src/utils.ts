import identity from "lodash/identity";
import merge from "lodash/merge";

export function css(...classNames: (string | undefined)[]): string {
  return classNames.filter(identity).join(" ");
}

export function mergeConfig<D = Record<string, unknown>, E = Record<string, unknown>>(
  defaults: D,
  explicits: E
): D & E {
  return merge({}, defaults, explicits);
}
