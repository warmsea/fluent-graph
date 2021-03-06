export interface IGraphProps {
  id: string;
  data: IGraphData;
  config?;
  onClickGraph?;

  onClickNode?;
  onDoubleClickNode?;
  onRightClickNode?;
  onMouseOverNode?;
  onMouseOutNode?;
  getLinkAriaLabel?;
  linkStrokeDashArray?;

  onClickLink?;
  onRightClickLink?;
  onMouseOverLink?;
  onMouseOutLink?;
  onKeyDownLink?;
  onNodePositionChange?;
  onZoomChange?;
}

export interface IGraphData {
  nodes: IGraphDataNode[];
  links: IGraphDataLink[];
  focusedNodeId?: string;
}

export interface IGraphDataNode {
  id: string;
}

export interface IGraphDataLink {
  source: string;
  target: string;
  value?: number;
}

export interface IGraphState {
  id;
  config;
  links;
  d3Links;
  nodes;
  d3Nodes;
  highlightedNode;
  highlightedLink?;
  simulation;
  newGraphElements;
  configUpdated;
  d3ConfigUpdated?;
  transform;
  draggedNode;
  focusedNodeId?;
  enableFocusAnimation?;
  focusTransformation?;
  previousZoom?;
}
