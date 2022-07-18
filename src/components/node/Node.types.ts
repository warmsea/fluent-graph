import React, { CSSProperties, ReactElement } from "react";
import { DivAttributes } from "../../utilities";

export interface INodeProps extends INodeCommonConfig {
  id: string;
  label?: string;
}

/**
 * Node configuration that can potential apply to all nodes.
 */
export interface INodeCommonConfig {
  /**
   * The size of the node. By default, it will draw a circle with `size` as the diameter.
   */
  size?: number;

  className?: string;
  style?: CSSProperties;
  attributes?: DivAttributes;

  nodeClassName?: string;
  nodeStyle?: CSSProperties;
  nodeAttributes?: DivAttributes;

  labelClassName?: string;
  labelStyle?: CSSProperties;
  labelOffset?: number;
  labelZoom?: number;
  labelAttributes?: DivAttributes;

  onRenderNode?: (props: INodeProps) => ReactElement;
  onRenderLabel?: (props: INodeProps) => ReactElement;

  onClickNode?: (props: INodeProps, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onRightClickNode?: (props: INodeProps, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onMouseOverNode?: (props: INodeProps, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onMouseOutNode?: (props: INodeProps, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}
