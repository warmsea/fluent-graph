import { merge, pick } from "lodash";

/**
 * Picks all props except the ones passed in the props array.
 * @param {Object} o - the object to pick props from.
 * @param {Array.<string>} props - list of props that we DON'T want to pick from o.
 * @returns {Object} the object resultant from the anti picking operation.
 * @memberof utils
 */
export function antiPick(o: object, props: string[] = []): Pick<any, string> {
  const wanted = Object.keys(o).filter(k => !props.includes(k));
  return pick(o, wanted);
}

export function mergeConfig<D = any, E = any>(
  defaults: D,
  explicits: E
): D & E {
  return merge({}, defaults, explicits);
}
