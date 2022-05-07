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
    className: classNames(styles.node, props.nodeClassName),
    style: {
      width: size,
      height: size,
      borderRadius: size / 2,
      ...props.nodeStyle,
    },

    onClick: (event) => props.onClickNode?.(props, event),
    onContextMenu: (event) => props.onRightClickNode?.(props, event),
    onMouseOver: (event) => props.onMouseOverNode?.(props, event),
    onMouseOut: (event) => props.onMouseOutNode?.(props, event),

    ...props.nodeAttributes,
  };

  return <div {...NODE_DRAGGABLE_ZONE_FLAG} {...nodeProps} />;
}

function defaultOnRenderLabel(props: INodeProps): ReactElement {
  const label = props.label ?? props.id;
  if (!label) {
    return <></>;
  }

  const labelProps: HTMLAttributes<HTMLDivElement> = {
    className: classNames(styles.label, props.labelClassName),
    style: {
      transform: `translate(-50%, ${props.labelOffset ?? 0}px) scale(${props.labelZoom ?? 1})`,
      ...props.labelStyle,
    },
    ...props.labelAttributes,
  };
  return <div {...labelProps}>{label}</div>;
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
