import React, { CSSProperties } from "react";

export interface ILinkProps extends ILinkEventHandlers {
  id: string;
  start: IPoint;
  end: IPoint;
  source: string; // TODO put into data:any?
  target: string; // TODO put into data:any?
  d?: string;
  className?: string;
  lineStyle?: CSSProperties;

  linkFocusable?: boolean;
  label?: string;
  labelStyle?: CSSProperties;
  getLinkAriaLabel?: (source: string, target: string) => string; // TODO want a better way
}

export interface ILinkEventHandlers {
  onClickLink?: (
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

export interface IPoint {
  x: number;
  y: number;
}
