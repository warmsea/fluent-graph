/**
 * @module Link/helper
 * @description
 * A set of helper methods to manipulate/create links.
 */

/**
 * This method returns the path definition for a given link base on the line type
 * and the link source and target.
 * {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d|d attribute mdn}
 * @param {Object} link - the link to build the path definition
 * @param {Object} link.source - link source
 * @param {Object} link.target - link target
 * @param {string} type - the link line type
 * @returns {string} the path definition for the requested link
 * @memberof Link/helper
 */
export function buildLinkPathDefinition({
  source = {} as any,
  target = {} as any
}): string {
  const { x: sx, y: sy } = source;
  const { x: tx, y: ty } = target;
  const radius = 0; // straight line

  return `M${sx},${sy}A${radius},${radius} 0 0,1 ${tx},${ty}`;
}
