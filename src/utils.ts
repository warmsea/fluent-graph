/**
 * @module utils
 * @description
 * Offers a series of generic methods for object manipulation, and other operations
 * that are common across rd3g such as error logging.
 */

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

/**
 * Formats an error message with fallbacks for the given parameters.
 * @param {string} component component name.
 * @param {string} msg message to log.
 * @returns {string} the error message.
 * @memberof utils
 */
function buildFormattedErrorMessage(component = "N/A", msg = "N/A") {
  return `fluent-graph :: ${component} :: ${msg}`;
}

/**
 * Helper function for customized error logging.
 * @param  {string} component - the name of the component where the error is to be thrown.
 * @param  {string} msg - the message contain a more detailed explanation about the error.
 * @returns {Error} the thrown error.
 * @memberof utils
 */
export function throwErr(component, msg) {
  throw Error(buildFormattedErrorMessage(component, msg));
}

/**
 * Logs formatted `fluent-graph` error with `console.error`.
 * @param {string} component component name.
 * @param {string} msg message to log.
 * @returns {undefined}
 * @memberof utils
 */
export function logError(component, msg) {
  console.error(buildFormattedErrorMessage(component, msg));
}

/**
 * Helper function for customized warning logging.
 * @param  {string} component - the name of the component where the warning is to be thrown.
 * @param  {string} msg - the message contain a more detailed explanation about the error.
 * @returns {Warning} the thrown warning.
 * @memberof utils
 */
export function logWarning(component, msg) {
  const warning = `fluent-graph :: ${component} :: ${msg}`;
  console.warn(warning);
}

export function mergeConfig<D = any, E = any>(
  defaults: D,
  explicits: E
): D & E {
  return merge({}, defaults, explicits);
}
