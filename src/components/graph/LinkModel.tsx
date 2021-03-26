import React from "react";
import { mergeConfig } from "../../utils";
import { Link } from "../link/Link";
import { ILinkCommonConfig, ILinkEnd } from "../link/Link.types";
import { IGraphPropsLink } from "./Graph.types";
import { NodeMap } from "./NodeMap";
import { NodeModel } from "./NodeModel";
import { SimulationLinkDatum, SimulationNodeDatum } from "d3";
import { default as CONST } from "./graph.const";

export class LinkModel {
  public sourceNode: NodeModel;
  public targetNode: NodeModel;
  public linkNode: NodeModel;

  private id: string;
  private linkNodeId: string;
  private props: IGraphPropsLink;

  public force: SimulationLinkDatum<SimulationNodeDatum>;

  constructor(
    props: IGraphPropsLink,
    linkConfig: ILinkCommonConfig,
    nodeMap: NodeMap
  ) {
    this.id = getLinkId(props);
    this.linkNodeId = getLinkNodeId(props);
    this.sourceNode = nodeMap.get(props.source);
    this.targetNode = nodeMap.get(props.target);
    this.linkNode = nodeMap.get(this.linkNodeId);
    this.props = mergeConfig(linkConfig, props);
    this.force = {
      source: this.props.source,
      target: this.props.target
    };
  }

  public update(props: IGraphPropsLink, linkConfig?: ILinkCommonConfig): void {
    if (getLinkId(props) !== this.id) {
      // TODO should not reach here
      return;
    }
    this.props = mergeConfig(linkConfig, props);
  }

  public renderLink(): JSX.Element {
    if (
      typeof this.sourceNode.force.x !== "number" ||
      typeof this.sourceNode.force.y !== "number" ||
      typeof this.targetNode.force.x !== "number" ||
      typeof this.targetNode.force.y !== "number"
    ) {
      return <React.Fragment key={this.id}></React.Fragment>;
    }

    const start: ILinkEnd = {
      x: this.sourceNode.force.x,
      y: this.sourceNode.force.y,
      offset: this.sourceNode.size
    };
    const end: ILinkEnd = {
      x: this.targetNode.force.x,
      y: this.targetNode.force.y,
      offset: this.targetNode.size
    };

    return (
      <Link
        key={this.id}
        id={this.id}
        start={start}
        end={end}
        {...this.props}
      />
    );
  }

  public renderLinkNode(): JSX.Element {
    return <React.Fragment key={this.id + ".linknode"}></React.Fragment>;
  }
}

export function getLinkId(link: { source: string; target: string }): string {
  return `${link.source},${link.target}`;
}

export function getLinkNodeId(link: {
  source: string;
  target: string;
}): string {
  return `${CONST.LINK_NODE_PREFIX}${link.source}-${link.target}`;
}
