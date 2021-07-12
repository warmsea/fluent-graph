import React from "react";
import { mergeConfig } from "../../utils";
import { Link } from "../link/Link";
import { ILinkCommonConfig, ILinkEnd } from "../link/Link.types";
import { IGraphLinkDatum, IGraphPropsLink } from "./Graph.types";
import { NodeMap, DELIMITER_SYMBOL } from "./NodeMap";
import { NodeModel } from "./NodeModel";
import { default as CONST } from "./graph.const";
const DELIMITER_SYMBOL: string = ",";

export class LinkModel {
  public sourceNode: NodeModel;
  public targetNode: NodeModel;
  public linkNode: NodeModel;

  private id: string;
  private linkNodeId: string;
  private props: IGraphPropsLink;

  public force: IGraphLinkDatum;

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
      source: this.sourceNode.force,
      target: this.targetNode.force
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
      offset: this.sourceNode.size / 2
    };
    const end: ILinkEnd = {
      x: this.targetNode.force.x,
      y: this.targetNode.force.y,
      offset: this.targetNode.size / 2
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
}

export function getLinkId(link: { source: string; target: string }): string {
  return `${link.source},${link.target}`;
}

export function getLinkNodeId(link: {
  source: string;
  target: string;
}): string {
  return `${CONST.LINK_NODE_PREFIX}${link.source}${DELIMITER_SYMBOL}${link.target}`;
}
