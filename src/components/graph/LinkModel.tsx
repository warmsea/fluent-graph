import React from 'react';
import { mergeConfig } from '../../utils';
import { Link } from '../link/Link';
import { ILinkCommonConfig } from '../link/Link.types';
import { IGraphPropsLink } from './Graph.types';
import { NodeMap } from './NodeMap';
import { NodeModel } from './NodeModel';

export class LinkModel {
  public sourceNode: NodeModel;
  public targetNode: NodeModel;

  private id: string;
  private props: IGraphPropsLink;

  constructor(props: IGraphPropsLink, linkConfig: ILinkCommonConfig, nodeMap: NodeMap) {
    this.props = mergeConfig(linkConfig, props);
    this.id = `${this.props.source},${this.props.target}`; // TODO do we need it?
    this.sourceNode = nodeMap.get(this.props.source);
    this.targetNode = nodeMap.get(this.props.target);
  }

  public renderLink(): JSX.Element {
    return (
      <Link
        key={this.id}
        id={this.id}
        start={mergeConfig({ x: 0, y: 0 }, this.sourceNode.force)}
        end={mergeConfig({ x: 0, y: 0 }, this.targetNode.force)}
        {...this.props}
      />
    );
  }
}
