import { SimulationNodeDatum } from "d3";
import React from "react";
import { mergeConfig } from "../../utils";
import { Node } from "../node/Node";
import { INodeCommonConfig } from "../node/Node.types";
import { IGraphPropsNode } from "./Graph.types";

export class NodeModel {
  private props: IGraphPropsNode;
  public id: string;
  public force: SimulationNodeDatum;

  constructor(props: IGraphPropsNode, nodeConfig: INodeCommonConfig) {
    this.props = mergeConfig(nodeConfig, props);
    this.id = this.props.id;
    this.force = {};
  }

  public renderNode(): JSX.Element {
    return (
      <g
        key={this.id}
        transform={`translate(${this.force.x ?? 0}, ${this.force.y ?? 0})`}
      >
        <Node {...this.props} />
      </g>
    );
  }
}
