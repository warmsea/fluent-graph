import React, { CSSProperties } from "react";

export interface ILinkProps extends ILinkCommonConfig {
  id: string;
  start: IPoint;
  end: IPoint;
  getLinkAriaLabel?: (props: ILinkProps) => string; // TODO find a better way?
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
    props: ILinkProps
  ) => void;
  onMouseOverLink?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    props: ILinkProps
  ) => void;
  onMouseOutLink?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    props: ILinkProps
  ) => void;
  onKeyDownLink?: (
    event: React.KeyboardEvent<SVGPathElement>,
    props: ILinkProps
  ) => void;
}

export interface IPoint {
  x: number;
  y: number;
}
