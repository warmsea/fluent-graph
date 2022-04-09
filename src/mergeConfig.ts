import merge from "lodash/merge";

export function mergeConfig<D = Record<string, unknown>, E = Record<string, unknown>>(
  defaults: D,
  explicits: E
): D & E {
  return merge({}, defaults, explicits);
}
