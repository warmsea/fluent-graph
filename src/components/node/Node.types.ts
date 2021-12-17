import React, { CSSProperties, ReactElement } from "react";

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

  nodeStyle?: CSSProperties;
  nodeFocusable?: boolean;
  nodeAriaLabel?: string;

  labelStyle?: CSSProperties;
  labelOffset?: number;
  labelZoom?: number;

  onRenderNode?: (props: INodeProps) => ReactElement;
  onRenderLabel?: (props: INodeProps) => ReactElement;
}

export interface INodeEventHandlers {
  onClickNode?: (props: INodeProps, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onContextMenu?: (props: INodeProps, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onMouseOverNode?: (props: INodeProps, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onMouseOutNode?: (props: INodeProps, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}
