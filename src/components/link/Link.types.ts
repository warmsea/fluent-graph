import React, { CSSProperties } from "react";

export interface ILinkProps extends ILinkCommonConfig {
  id: string;
  start: IPoint;
  end: IPoint;
  source: string; // TODO put into data:any?
  target: string; // TODO put into data:any?
  getLinkAriaLabel?: (source: string, target: string) => string; // TODO find a better way?
  // TODO accept offset for start and end
}

export interface ILinkCommonConfig extends ILinkEventHandlers {
  className?: string;
  lineStyle?: CSSProperties;

  focusable?: boolean;
  label?: string;
  labelStyle?: CSSProperties;
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
