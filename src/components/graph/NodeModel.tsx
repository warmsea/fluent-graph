import React from "react";
import { mergeConfig } from "../../utils";
import { Node } from "../node/Node";
import NodeLabel from "../node/NodeLabel";
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
    const {
      label,
      onRenderNodeLabel,
      size = 8,
      nodeStyle,
      labelStyle,
      labelOffset
    } = this.props;

    return (
      <div className="fg-node" id={this.id} key={this.id}>
        <Node
          size={size}
          style={{
            position: "absolute",
            left: this.force.x,
            top: this.force.y
          }}
          nodeStyle={nodeStyle}
          {...this.props}
        />
        {(label || onRenderNodeLabel) && (
          <NodeLabel
            style={{
              position: "absolute",
              display: "inline-block",
              top: this.force.y,
              left: this.force.x,
              transform: `translate(-50%, ${labelOffset || 10}px)`,
              whiteSpace: "nowrap",
              zIndex: 3,
              ...labelStyle
            }}
            label={label}
            onRenderNodeLabel={onRenderNodeLabel}
            {...this.props}
          />
        )}
      </div>
    );
  }
}
