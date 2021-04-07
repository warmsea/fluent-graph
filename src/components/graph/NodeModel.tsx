import React from "react";
import { mergeConfig } from "../../utils";
import { Node } from "../node/Node";
import { INodeCommonConfig } from "../node/Node.types";
import { IGraphPropsNode } from "./Graph.types";
import { IGraphNodeDatum } from "./LinkMap";

export class NodeModel {
  private props: IGraphPropsNode;
  public id: string;
  public size: number;
  public force: IGraphNodeDatum;

  constructor(props: IGraphPropsNode, nodeConfig: INodeCommonConfig) {
    this.id = props.id;
    this.size = props.size ?? 0;
    this.force = {
      id: props.id,
      x: props.initialX,
      y: props.initialY
    };

    this.props = mergeConfig(nodeConfig, props);
    this.size = this.props.size ?? 0;
  }

  public update(props: IGraphPropsNode, nodeConfig: INodeCommonConfig) {
    if (props.id !== this.props.id) {
      // TODO should not reach here
      return;
    }

    this.props = mergeConfig(nodeConfig, props);
    this.size = this.props.size ?? 0;
  }

  public renderNode(): JSX.Element {
    return (
      <Node
        key={this.props.id}
        {...this.props}
        style={{
          position: "absolute",
          left: this.force.x,
          top: this.force.y,
          ...this.props.style
        }}
      />
    );
  }
}
