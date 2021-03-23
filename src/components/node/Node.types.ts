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
    nodeId: string
  ) => void;
  onMouseOverNode?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    nodeId: string
  ) => void;
  onMouseOutNode?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    nodeId: string
  ) => void;
}
