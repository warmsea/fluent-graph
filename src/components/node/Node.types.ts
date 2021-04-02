import React from "react";

export interface ILabelPlacementProps {
  dx: string;
  dy: string;
  dominantBaseline?: string;
  textAnchor?: string;
}

export interface INodeProps extends INodeCommonConfig {
  id: string;
  label?: string;
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
  style?: React.CSSProperties;

  nodeStyle?: React.CSSProperties;
  focusable?: boolean;

  labelStyle?: React.CSSProperties;
  labelOffset?: number;

  onRenderNode?: (props: INodeProps) => React.ReactNode;
  onRenderLabel?: (props: INodeProps) => React.ReactNode;
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
