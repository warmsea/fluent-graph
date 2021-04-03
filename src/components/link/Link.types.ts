import React, { CSSProperties } from "react";

export interface ILinkProps extends ILinkCommonConfig {
  id: string;
  start: ILinkEnd;
  end: ILinkEnd;
  getLinkAriaLabel?: (props: ILinkProps) => string; // TODO find a better way?
  // TODO accept offset for start and end
}

export interface ILinkCommonConfig extends ILinkEventHandlers {
  size?: number;
  style?: CSSProperties;
  className?: string;
  lineStyle?: CSSProperties;
  focusable?: boolean;
}

export interface ILinkEventHandlers {
  onClickLink?: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    props: ILinkProps
  ) => void;
  onMouseOverLink?: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    props: ILinkProps
  ) => void;
  onMouseOutLink?: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    props: ILinkProps
  ) => void;
  onKeyDownLink?: (
    event: React.KeyboardEvent<HTMLElement>,
    props: ILinkProps
  ) => void;
}

export interface ILinkEnd {
  x: number;
  y: number;
  offset?: number;
}
