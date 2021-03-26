import React from "react";
import { merge } from "lodash";

import { INodeCommonConfig, INodeProps } from "./Node.types";

export const DEFAULT_NODE_PROPS: INodeCommonConfig = {
  size: 10,
  nodeStyle: {
    background: "#d3d3d3"
  }
};

export const Node = (props: INodeProps) => {
  props = merge({}, DEFAULT_NODE_PROPS, props);

  const nodeProps: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > = {
    id: props.id,
    tabIndex: props.focusable ? 0 : undefined,
    style: props.style,
    className: "fg-node",
    onClick: event => props.onClickNode?.(props, event),
    onContextMenu: event => props.onContextMenu?.(props, event),
    onMouseOver: event => props.onMouseOverNode?.(props, event),
    onMouseOut: event => props.onMouseOutNode?.(props, event)
  };

  if (props.onRenderNode) {
    return <>{props.onRenderNode(props)}</>;
  }
  return <div {...nodeProps}></div>;
};
