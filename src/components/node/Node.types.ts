import React from "react";

export type LabelPosition = "left" | "right" | "top" | "bottom" | "center";

export interface ILabelPlacementProps {
  dx: string;
  dy: string;
  dominantBaseline?: string;
  textAnchor?: string;
}

export interface INodeProps extends INodeCommonConfig {
  style?: React.CSSProperties;
  id: string;
  label?: string;
  initialX?: number;
  initialY?: number;
}

/**
 * Node configuration that can potential apply to all nodes.
 */
export interface INodeCommonConfig extends INodeEventHandlers {
  /**
   * The size of the node. By default, it will draw a circle with `size` as the diameter.
   */
  size?: number;
  className?: string;
  nodeStyle?: React.CSSProperties;

  focusable?: boolean;
  labelPosition?: LabelPosition;
  labelOffset?: number;
  labelStyle?: React.CSSProperties;

  onRenderNode?: (props: INodeProps) => React.ReactNode;
  onRenderNodeLabel?: (props: INodeProps) => React.ReactNode;
}

export interface INodeEventHandlers {
  onClickNode?: (
    props: INodeProps,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  onContextMenu?: (
    props: INodeProps,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  onMouseOverNode?: (
    props: INodeProps,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  onMouseOutNode?: (
    props: INodeProps,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
}
