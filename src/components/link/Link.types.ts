import React, { CSSProperties } from "react";

export interface ILinkProps {
  id: string;
  source: string;
  target: string;
  d?: string;
  className?: string;
  lineStyle?: CSSProperties;

  linkFocusable?: boolean;
  label?: string;
  labelStyle?: CSSProperties;
  getLinkAriaLabel?: (source: string, target: string) => string; // TODO want a better way

  onClickLink?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    source: string,
    target: string
  ) => void;
  onRightClickLink?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    source: string,
    target: string
  ) => void;
  onMouseOverLink?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    source: string,
    target: string
  ) => void;
  onMouseOutLink?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    source: string,
    target: string
  ) => void;
  onKeyDownLink?: (
    event: React.KeyboardEvent<SVGPathElement>,
    source: string,
    target: string
  ) => void;
}
