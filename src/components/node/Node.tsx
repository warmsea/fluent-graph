import React, { HTMLAttributes, ReactNode } from "react";
import { css, mergeConfig } from "../../utils";
import { INodeCommonConfig, INodeProps } from "./Node.types";

export const NODE_CLASS_ROOT: string = "fg-node-root";
export const NODE_CLASS_NODE: string = "fg-node-node";
export const NODE_CLASS_LABEL: string = "fg-node-label";
export const DEFAULT_NODE_PROPS: INodeCommonConfig = {
  size: 20,
  nodeStyle: {
    boxSizing: "border-box",
    backgroundColor: "#d3d3d3",
    transform: "translate(-50%, -50%)",
    zIndex: 3
  }
};

function defaultOnRenderNode(props: INodeProps): ReactNode {
  const nodeProps: HTMLAttributes<HTMLDivElement> = {
    className: NODE_CLASS_NODE,
    style: {
      width: props.size,
      height: props.size,
      borderRadius: props.size! / 2,
      ...props.nodeStyle
    },

    tabIndex: props.focusable ? 0 : undefined,

    onClick: event => props.onClickNode?.(props, event),
    onContextMenu: event => props.onContextMenu?.(props, event),
    onMouseOver: event => props.onMouseOverNode?.(props, event),
    onMouseOut: event => props.onMouseOutNode?.(props, event)
  };

  return <div className={NODE_CLASS_NODE} {...nodeProps} />;
}

export const Node = (props: INodeProps) => {
  props = mergeConfig(DEFAULT_NODE_PROPS, props);

  return (
    <div
      id={props.id}
      className={css(NODE_CLASS_ROOT, props.className)}
      style={props.style}
    >
      {(props.onRenderNode ?? defaultOnRenderNode)(props)}
    </div>
  );
};
