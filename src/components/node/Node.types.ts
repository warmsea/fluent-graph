import React, { CSSProperties, ReactElement } from "react";
import { HTMLFreeAttributes } from "../../utilities";

export interface INodeProps extends INodeCommonConfig {
  id: string;
  label?: string;
}

/**
 * Node configuration that can potential apply to all nodes.
 */
export interface INodeCommonConfig extends INodeEventHandlers {
  /**
   * The size of the node. By default, it will draw a circle with `size` as the diameter.
   */
  size?: number;

  className?: string;
  style?: CSSProperties;
  attributes?: HTMLFreeAttributes<HTMLDivElement>;

  nodeClassName?: string;
  nodeStyle?: CSSProperties;
  nodeAttributes?: HTMLFreeAttributes<HTMLDivElement>;

  labelClassName?: string;
  labelStyle?: CSSProperties;
  labelOffset?: number;
  labelZoom?: number;
  labelAttributes?: HTMLFreeAttributes<HTMLDivElement>;

  onRenderNode?: (props: INodeProps) => ReactElement;
  onRenderLabel?: (props: INodeProps) => ReactElement;
}

export interface INodeEventHandlers {
  onClickNode?: (props: INodeProps, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onRightClickNode?: (props: INodeProps, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onMouseOverNode?: (props: INodeProps, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onMouseOutNode?: (props: INodeProps, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}
