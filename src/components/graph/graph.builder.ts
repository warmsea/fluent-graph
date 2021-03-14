/**
 * @module Graph/builder
 * @description
 * Offers a series of methods that isolate the way graph elements are built (nodes and links mainly).
 */
import CONST from "./graph.const";

import { buildLinkPathDefinition } from "../link/link.helper";
import { getNormalizedNodeCoordinates } from "./graph.helper";
import { INodeProps } from "../node/Node.types";
import { CSSProperties } from "react";
import { ILinkProps } from "../link/Link.types";

/**
 * Build some Link properties based on given parameters.
 * @param  {Object} link - the link object for which we will generate properties.
 * @param  {Object.<string, Object>} nodes - same as {@link #graphrenderer|nodes in renderGraph}.
 * @param  {Object.<string, Object>} links - same as {@link #graphrenderer|links in renderGraph}.
 * @param  {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @param  {Function[]} linkCallbacks - same as {@link #graphrenderer|linkCallbacks in renderGraph}.
 * @returns {Object} returns an object that aggregates all props for creating respective Link component instance.
 * @memberof Graph/builder
 */
export function buildLinkProps(
  link,
  nodes,
  config,
  linkCallbacks,
  key
): ILinkProps {
  const { source, target } = link;
  let x1 = nodes?.[source]?.x || 0;
  let y1 = nodes?.[source]?.y || 0;
  let x2 = nodes?.[target]?.x || 0;
  let y2 = nodes?.[target]?.y || 0;

  let strokeWidth = link.strokeWidth ?? config.link.strokeWidth;

  const lineStyle: CSSProperties = {
    cursor: config.link.lineStyle.cursor,
    opacity: link.opacity ?? config.link.lineStyle.opacity,
    stroke: link.color ?? config.link.lineStyle.stroke,
    strokeWidth
  };

  const labelStyle: CSSProperties = {
    fontSize: link.fontSize ?? config.link.lineStyle.fontSize,
    color: link.fontColor ?? config.link.lineStyle.color,
    fontWeight: config.link.fontWeight
  };

  const normalizedNodeCoordinates = getNormalizedNodeCoordinates(
    {
      source: { x: x1, y: y1, id: source },
      target: { x: x2, y: y2, id: target }
    },
    nodes,
    config
  );
  const d = buildLinkPathDefinition(normalizedNodeCoordinates);

  return {
    id: key,
    className: CONST.LINK_CLASS_NAME,
    d,
    source,
    target,
    lineStyle,
    label: link.label,
    labelStyle,
    onClickLink: linkCallbacks.onClickLink,
    onMouseOutLink: linkCallbacks.onMouseOutLink,
    onMouseOverLink: linkCallbacks.onMouseOverLink,
    onRightClickLink: linkCallbacks.onRightClickLink,
    onKeyDownLink: linkCallbacks.onKeyDownLink,
    getLinkAriaLabel: linkCallbacks.getLinkAriaLabel,
    linkFocusable: config.link.linkFocusable
  };
}

/**
 * Build some Node properties based on given parameters.
 * @param  {Object} node - the node object for whom we will generate properties.
 * @param  {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @param  {Function[]} nodeCallbacks - same as {@link #graphrenderer|nodeCallbacks in renderGraph}.
 * @param  {number} transform - value that indicates the amount of zoom transformation.
 * @returns {Object} returns object that contain Link props ready to be feeded to the Link component.
 * @memberof Graph/builder
 */
export function buildNodeProps(
  node,
  config,
  nodeCallbacks: any = {}
): INodeProps {
  let label = node.label ?? node.id;
  const nodeSize = node.size || config.node.size;

  let offset = nodeSize;

  const fontSize = config.node.fontSize;
  const labelOffset = fontSize + offset / 100 + 1.5;

  const nodeStyle = {
    ...node.nodeStyle,
    ...config.node.nodeStyle
  };

  const labelStyle = {
    ...node.labelStyle,
    ...config.node.labelStyle
  };

  return {
    id: node.id,
    size: nodeSize,
    x: node?.x || "0",
    y: node?.y || "0",
    className: CONST.NODE_CLASS_NAME,
    nodeStyle,
    label,
    labelPosition: node.labelPosition ?? config.node.labelPosition,
    labelOffset,
    labelStyle,
    onClickNode: nodeCallbacks.onClickNode,
    onMouseOutNode: nodeCallbacks.onMouseOut,
    onMouseOverNode: nodeCallbacks.onMouseOverNode
  };
}
