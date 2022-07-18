import isNumber from "lodash/isNumber";
import React, { ReactElement } from "react";
import { mergeConfig } from "../../mergeConfig";
import { Link } from "../link/Link";
import { ILinkCommonConfig, ILinkPoint } from "../link/Link.types";
import { IGraphLinkDatum, IGraphPropsLink } from "./Graph.types";
import { NodeMap } from "./NodeMap";
import { NodeModel } from "./NodeModel";

export class LinkModel {
  public id: string;
  public sourceNode: NodeModel;
  public targetNode: NodeModel;
  public force: IGraphLinkDatum;

  private props: IGraphPropsLink;

  constructor(id: string, props: IGraphPropsLink, linkConfig: ILinkCommonConfig, nodeMap: NodeMap) {
    this.id = id;

    const sourceNode = nodeMap.get(props.source);
    if (!sourceNode) {
      throw new Error(`This is likely a Fluent Graph bug, node not exist: ${props.source}`);
    }

    const targetNode = nodeMap.get(props.target);
    if (!targetNode) {
      throw new Error(`This is likely a Fluent Graph bug, node not exist: ${props.target}`);
    }

    this.sourceNode = sourceNode;
    this.targetNode = targetNode;
    this.props = mergeConfig(linkConfig, props);
    this.force = {
      source: sourceNode.force,
      target: targetNode.force,
    };
  }

  public update(id: string, props: IGraphPropsLink, linkConfig?: ILinkCommonConfig): void {
    if (id !== this.id) {
      throw new Error(`This is likely a Fluent Graph bug, link not exist: ${id}`);
    }
    this.props = mergeConfig(linkConfig, props);
  }

  public renderLink(): ReactElement {
    const source = this.sourceNode;
    const target = this.targetNode;
    if (
      !isNumber(source.force.x) ||
      !isNumber(source.force.y) ||
      !isNumber(target.force.x) ||
      !isNumber(target.force.y)
    ) {
      return <React.Fragment key={this.id}></React.Fragment>;
    }

    const start: ILinkPoint = {
      x: source.force.x,
      y: source.force.y,
      offset: source.size / 2,
    };
    const end: ILinkPoint = {
      x: target.force.x,
      y: target.force.y,
      offset: target.size / 2,
    };

    return <Link key={this.id} id={this.id} {...{ start, end }} {...this.props} />;
  }
}
