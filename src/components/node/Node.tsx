import { classNames } from "@warmsea/h";
import React, { HTMLAttributes, ReactElement } from "react";
import { INodeProps } from "./Node.types";
import styles from "./Node.scss";

/**
 * @deprecated
 */
export const NODE_CLASS_ROOT = "fg-node-root";
/**
 * @deprecated
 */
export const NODE_CLASS_NODE = "fg-node-node";
/**
 * @deprecated
 */
export const NODE_CLASS_LABEL = "fg-node-label";

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

  return <div className={classNames(NODE_CLASS_NODE, styles.node)} {...nodeProps} />;
}

function defaultOnRenderLabel(props: INodeProps): ReactElement {
  const label = props.label ?? props.id;
  if (label) {
    return (
      <div
        className={styles.label}
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
      className={classNames(NODE_CLASS_ROOT, styles.root, props.className)}
      style={props.style}
    >
      {(props.onRenderNode ?? defaultOnRenderNode)(props)}
      {(props.onRenderLabel ?? defaultOnRenderLabel)(props)}
    </div>
  );
};
