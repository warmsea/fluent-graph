import React from "react";

export type LabelPosition = "left" | "right" | "top" | "bottom" | "center";

export interface ILabelPlacementProps {
  dx: string;
  dy: string;
  dominantBaseline?: string;
  textAnchor?: string;
}

export interface INodeProps {
  id: string;
  size: number;
  cx: number;
  cy: number;
  type?: string;
  viewGenerator?: (nodeProps: INodeProps) => JSX.Element;
  svg?: string;

  className?: string;
  nodeStyle?: React.CSSProperties;

  label?: string;
  labelPosition?: LabelPosition;
  labelOffset?: number;
  labelStyle?: React.CSSProperties;

  onClickNode?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    nodeId: string
  ) => void;
  onRightClickNode?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    nodeId: string
  ) => void;
  onMouseOverNode?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    nodeId: string
  ) => void;
  onMouseOut?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    nodeId: string
  ) => void;
}
