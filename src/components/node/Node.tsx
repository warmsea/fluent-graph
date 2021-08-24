import React, { HTMLAttributes, ReactNode } from "react";
import { css, mergeConfig } from "../../utils";
import { INodeCommonConfig, INodeProps } from "./Node.types";

export const NODE_CLASS_ROOT: string = "fg-node-root";
export const NODE_CLASS_NODE: string = "fg-node-node";
export const NODE_CLASS_LABEL: string = "fg-node-label";
export const DEFAULT_NODE_PROPS: INodeCommonConfig = {
  size: 20,
  style: {
    zIndex: 3,
    // Since node and label used transform to calculate their positions.
    // The root node container will have offset, set the size to 0 to avoid the offset of root node container. 
    width: 0,
    height: 0
  },
  nodeStyle: {
    boxSizing: "border-box",
    backgroundColor: "lightgray",
    transform: "translate(-50%, -50%)"
  }
};

function defaultOnRenderNode(props: INodeProps): ReactNode {
  const size: number = props.size ?? DEFAULT_NODE_PROPS.size!;
  const nodeProps: HTMLAttributes<HTMLDivElement> = {
    className: NODE_CLASS_NODE,
    style: {
      width: size,
      height: size,
      borderRadius: size / 2,
      ...props.nodeStyle
    },

    tabIndex: props.nodeFocusable ? 0 : undefined,
    "aria-label": props.nodeAriaLabel,

    onClick: event => props.onClickNode?.(props, event),
    onContextMenu: event => props.onContextMenu?.(props, event),
    onMouseOver: event => props.onMouseOverNode?.(props, event),
    onMouseOut: event => props.onMouseOutNode?.(props, event)
  };

  return <div className={NODE_CLASS_NODE} {...nodeProps} />;
}

function defaultOnRenderLabel(props: INodeProps): ReactNode {
  const label = props.label ?? props.id;
  if (label) {
    return (
      <div
        style={{
          transform: `translate(-50%, ${props.labelOffset ??
            0}px) scale(${props.labelZoom ?? 1})`,
          ...props.labelStyle
        }}
      >
        {label}
      </div>
    );
  } else {
    return <></>;
  }
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
      {(props.onRenderLabel ?? defaultOnRenderLabel)(props)}
    </div>
  );
};
