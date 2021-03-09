export interface ILinkProps {
  id: string;
  source: string;
  target: string;
  strokeWidth: number;
  d?: string;
  className?: string;
  mouseCursor?: string;
  stroke?: string;
  opacity?: string | number;
  linkStrokeDashArray?: (source: string, target: string) => string;

  linkFocusable?: boolean;
  label?: string;
  fontColor?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  getLinkAriaLabel?: (source: string, target: string) => string;

  onClickLink?: (event: React.MouseEvent<SVGPathElement, MouseEvent>, source: string, target: string) => void;
  onRightClickLink?: (event: React.MouseEvent<SVGPathElement, MouseEvent>, source: string, target: string) => void;
  onMouseOverLink?: (event: React.MouseEvent<SVGPathElement, MouseEvent>, source: string, target: string) => void;
  onMouseOutLink?: (event: React.MouseEvent<SVGPathElement, MouseEvent>, source: string, target: string) => void;
  onKeyDownLink?: (event: React.KeyboardEvent<SVGPathElement>, source: string, target: string) => void;
}
