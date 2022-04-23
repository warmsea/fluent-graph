import { classNames } from "@warmsea/h";
import React, { HTMLAttributes, ReactElement } from "react";
import { INodeProps } from "./Node.types";
import styles from "./Node.scss";

export const NODE_DRAGGABLE_ZONE_FLAG = {
  "data-fg-element": "node-draggable-zone",
};

export const DEFAULT_NODE_SIZE = 20;

function defaultOnRenderNode(props: INodeProps): ReactElement {
  const size: number | undefined = props.size ?? DEFAULT_NODE_SIZE;
  const nodeProps: HTMLAttributes<HTMLDivElement> = {
    style: {
      width: size,
      height: size,
      borderRadius: size / 2,
      ...props.nodeStyle,
    },

    tabIndex: props.nodeFocusable ? 0 : undefined,
    "aria-label": props.nodeAriaLabel,

    onClick: (event) => props.onClickNode?.(props, event),
    onContextMenu: (event) => props.onContextMenu?.(props, event),
    onMouseOver: (event) => props.onMouseOverNode?.(props, event),
    onMouseOut: (event) => props.onMouseOutNode?.(props, event),
  };

  return (
    <div
      className={classNames(styles.node, props.nodeClassName)}
      {...NODE_DRAGGABLE_ZONE_FLAG}
      {...nodeProps}
    />
  );
}

function defaultOnRenderLabel(props: INodeProps): ReactElement {
  const label = props.label ?? props.id;
  if (label) {
    return (
      <div
        className={classNames(styles.label, props.labelClassName)}
        style={{
          transform: `translate(-50%, ${props.labelOffset ?? 0}px) scale(${props.labelZoom ?? 1})`,
          ...props.labelStyle,
        }}
      >
        {label}
      </div>
    );
  } else {
    return <></>;
  }
}

export const Node = (props: INodeProps): ReactElement => {
  return (
    <div
      id={props.id}
      className={classNames(styles.root, props.className)}
      data-fg-element="node-root"
      style={props.style}
    >
      {(props.onRenderNode ?? defaultOnRenderNode)(props)}
      {(props.onRenderLabel ?? defaultOnRenderLabel)(props)}
    </div>
  );
};
