import React, { ReactElement } from "react";
import { mergeConfig } from "../../mergeConfig";
import { Node } from "../node/Node";
import { INodeCommonConfig } from "../node/Node.types";
import { IGraphNodeDatum, IGraphPropsNode } from "./Graph.types";
import { IZoomState, Ref } from "./Graph.types.internal";

export class NodeModel {
  private props: IGraphPropsNode;
  public id: string;
  public size: number;
  public force: IGraphNodeDatum;

  constructor(node: IGraphPropsNode, nodeConfig: INodeCommonConfig) {
    this.id = node.id;
    this.size = node.size ?? 0;
    this.force = {
      id: node.id,
      size: this.size,
      ...node.force,
    };

    this.props = mergeConfig(nodeConfig, node);
    this.size = this.props.size ?? 0;
  }

  public update(props: IGraphPropsNode, nodeConfig: INodeCommonConfig): void {
    if (props.id !== this.props.id) {
      // TODO should not reach here
      return;
    }
    this.props = mergeConfig(nodeConfig, props);
    this.size = this.props.size ?? 0;
  }

  public renderNode(zoomStateRef?: Ref<IZoomState>): ReactElement {
    let zoom: number | undefined = zoomStateRef?.current.k;
    if (zoom !== undefined) {
      if (zoom > 1) {
        zoom = 1 / zoom;
      } else {
        zoom = 1;
      }
    }
    return (
      <Node
        key={this.props.id}
        {...this.props}
        style={{
          position: "absolute",
          left: this.force.x,
          top: this.force.y,
          ...this.props.style,
        }}
        labelZoom={this.props.labelZoom ?? zoom}
      />
    );
  }
}
