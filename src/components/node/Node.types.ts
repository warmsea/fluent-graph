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
  svg?: string;
  viewGenerator?: (nodeProps: INodeProps) => JSX.Element;
  overrideGlobalViewGenerator?: boolean;

  className?: string;
  cursor?: string;
  opacity?: number;
  fontColor?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  dx?: number;
  labelPosition?: LabelPosition;
  label?: string;
  renderLabel?: boolean;

  fill?: string;
  stroke?: string;
  strokeWidth?: string | number;

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
