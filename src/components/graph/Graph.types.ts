import { SimulationNodeDatum } from "d3";
import { MutableRefObject } from "react";
import { ILinkCommonConfig } from "../link/Link.types";
import { INodeCommonConfig, INodeProps } from "../node/Node.types";

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

/**
 * Full set of graph configuration.
 */
export interface IGraphConfig {
  automaticRearrangeAfterDropNode: boolean;
  focusZoom: number;
  freezeAllDragEvents: boolean;
  focusAnimationDuration: number;
  height: number;
  initialZoom: number | undefined;
  maxZoom: number;
  minZoom: number;
  panAndZoom: boolean;
  staticGraph: boolean;
  staticGraphWithDragAndDrop: boolean;
  width: number;
  d3: IGraphConfigD3;
}

export interface IGraphConfigD3 {
  alphaTarget: number;
  gravity: number;
  linkLength: number;
  linkStrength: number;
  disableLinkForce: boolean;
  paddingRadius: number;
}

export interface IGraphProps {
  id: string;
  nodes: IGraphPropsNode[];
  links: IGraphPropsLink[];
  focusedNodeId?: string;
  nodeConfig?: INodeCommonConfig;
  linkConfig?: ILinkCommonConfig;
  config?: IGraphPropsConfig;

  behaviorRef?: MutableRefObject<IGraphBehavior>;

  onClickGraph?;
  onNodePositionChange?;
  onZoomChange?;
}

export interface IGraphPropsNode extends INodeProps {
  /**
   * The darum of a simulation node. For example, you can use `x` and `y` to
   * set the initial position. Or use `fx` and `fy` to set a fixed position.
   */
  force?: SimulationNodeDatum;
}

export interface IGraphPropsLink extends ILinkCommonConfig {
  source: string;
  target: string;
}

export interface IGraphPropsData {
  nodes: IGraphPropsDataNode[];
  links: IGraphPropsDataLink[];
  focusedNodeId?: string;
}

export interface IGraphPropsDataNode {
  id: string;
}

export interface IGraphPropsDataLink {
  source: string;
  target: string;
  value?: number;
}

export type IGraphPropsConfig = DeepPartial<IGraphConfig>;

export interface IGraphState {
  id?: string;
  config: IGraphConfig;
  links;
  d3Links;
  nodes;
  d3Nodes;
  simulation;
  newGraphElements;
  configUpdated;
  d3ConfigUpdated?;
  transform;
  draggedNode;
  focusedNodeId?;
  enableFocusAnimation?;
  focusTransformation?;
  previousZoom?;
}

export interface IGraphLinkMap {
  [sourceNodeId: string]: {
    [targetNodeId: string]: number;
  };
}

export interface IGraphNodeMap {
  [nodeId: string]: any;
}

export interface IGraphBehavior {
  zoomBy: (k: number) => void;
  resetZoom: () => void;
}
