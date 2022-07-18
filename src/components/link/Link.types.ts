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
  start: ILinkPoint;
  end: ILinkPoint;
}

export interface ILinkCommonConfig {
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
  attributes?: DivAttributes;

  linkClassName?: string;
  linkType?: ILinkType;
  linkStyle?: CSSProperties;
  linkAttributes?: DivAttributes;

  onClickLink?: (props: ILinkProps, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onMouseOverLink?: (props: ILinkProps, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onMouseOutLink?: (props: ILinkProps, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onKeyDownLink?: (props: ILinkProps, event: React.KeyboardEvent<HTMLElement>) => void;
}

export interface ILinkPoint {
  x: number;
  y: number;
  offset?: number;
}
