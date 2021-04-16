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
  height: number;
  width: number;
  zoom: IGraphConfigZoom;
  sim: IGraphConfigSim;
}

export interface IGraphConfigSim {
  gravity: number;
  linkLength: number;
  linkStrength: number;
  paddingRadius: number;
}

export interface IGraphConfigZoom {
  maxZoom: number;
  minZoom: number;
  initialZoom: number;
}

export interface IGraphProps {
  id: string;
  nodes: IGraphPropsNode[];
  links: IGraphPropsLink[];
  focusedNodeId?: string;
  nodeConfig?: INodeCommonConfig;
  linkConfig?: ILinkCommonConfig;
  config?: IGraphPropsConfig;

  /**
   * A reference to control graph behavior like zooming from outside.
   */
  behaviorRef?: MutableRefObject<IGraphBehavior>;
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
