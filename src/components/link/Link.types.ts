import React, { CSSProperties, HTMLAttributes } from "react";

export type ILinkType =
  | "none"
  | "hidden"
  | "dotted"
  | "dashed"
  | "solid"
  | "double"
  | "groove"
  | "ridge"
  | "inset"
  | "outset";

export interface ILinkProps extends ILinkCommonConfig {
  id: string;
  start: ILinkEnd;
  end: ILinkEnd;
}

export interface ILinkCommonConfig extends ILinkEventHandlers {
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;

  lineClassName?: string;
  lineType?: ILinkType;
  lineStyle?: CSSProperties;
  lineProps?: HTMLAttributes<HTMLDivElement>;
}

export interface ILinkEventHandlers {
  onClickLink?: (event: React.MouseEvent<HTMLElement, MouseEvent>, props: ILinkProps) => void;
  onMouseOverLink?: (event: React.MouseEvent<HTMLElement, MouseEvent>, props: ILinkProps) => void;
  onMouseOutLink?: (event: React.MouseEvent<HTMLElement, MouseEvent>, props: ILinkProps) => void;
  onKeyDownLink?: (event: React.KeyboardEvent<HTMLElement>, props: ILinkProps) => void;
}

export interface ILinkEnd {
  x: number;
  y: number;
  offset?: number;
}
