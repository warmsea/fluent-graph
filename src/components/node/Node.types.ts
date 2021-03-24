import React from "react";

export type LabelPosition = "left" | "right" | "top" | "bottom" | "center";

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
  nodeStyle?: React.CSSProperties;

  labelPosition?: LabelPosition;
  labelOffset?: number;
  labelStyle?: React.CSSProperties;

  onRenderNode?: (props: INodeProps) => JSX.Element;
  onRenderLabel?: (props: INodeProps) => JSX.Element;
}

export interface INodeEventHandlers {
  onClickNode?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    props: INodeProps
  ) => void;
  onMouseOverNode?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    props: INodeProps
  ) => void;
  onMouseOutNode?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    props: INodeProps
  ) => void;
}
