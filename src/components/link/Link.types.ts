import React, { CSSProperties } from "react";
import { DivAttributes } from "../../utilities";

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
  attributes?: DivAttributes;

  linkClassName?: string;
  linkType?: ILinkType;
  linkStyle?: CSSProperties;
  linkAttributes?: DivAttributes;
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
