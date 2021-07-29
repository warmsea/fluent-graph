import React from "react";
import { mergeConfig } from "../../utils";
import { Node } from "../node/Node";
import { INodeCommonConfig } from "../node/Node.types";
import { IGraphNodeDatum, IGraphPropsNode } from "./Graph.types";
import { IZoomState, Ref } from "./Graph.types.internal";

export class NodeModel {
  private props: IGraphPropsNode;
  private _zoomStateRef: Ref<IZoomState> | undefined;
  public id: string;
  public size: number;
  public force: IGraphNodeDatum;
  public relatedNodesOfLinkNode: string[];
  public isLinkNode: boolean;

  constructor(
    props: IGraphPropsNode,
    nodeConfig: INodeCommonConfig,
    zoomStateRef?: Ref<IZoomState>,
    relatedNodesOfLinkNode?: string[],
    isLinkNode?: boolean
  ) {
    this.id = props.id;
    this.size = props.size ?? 0;
    this.force = {
      id: props.id,
      size: this.size,
      ...props.force
    };
    this._zoomStateRef = zoomStateRef;

    this.props = mergeConfig(nodeConfig, props);
    this.size = this.props.size ?? 0;
    this.relatedNodesOfLinkNode = relatedNodesOfLinkNode ?? [];
    this.isLinkNode = !!isLinkNode;
  }

  public update(
    props: IGraphPropsNode,
    nodeConfig: INodeCommonConfig,
    relatedNodesOfLinkNode?: string[],
    isLinkNode?: boolean
  ) {
    if (props.id !== this.props.id) {
      // TODO should not reach here
      return;
    }
    this.props = mergeConfig(nodeConfig, props);
    this.size = this.props.size ?? 0;
    this.relatedNodesOfLinkNode = relatedNodesOfLinkNode ?? [];
    this.isLinkNode = !!isLinkNode;
  }

  public renderNode(): JSX.Element {
    let zoom: number | undefined = this._zoomStateRef?.current.k;
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
          ...this.props.style
        }}
        labelZoom={this.props.labelZoom ?? zoom}
      />
    );
  }
}
