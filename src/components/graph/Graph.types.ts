export interface IGraphProps {
  id: string;
  data: IGraphData;
  config: IGraphConfig;
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

export interface IGraphConfig {
  automaticRearrangeAfterDropNode: boolean;
  directed: boolean;
  focusZoom: number;
  focusAnimationDuration: number;
  height: number;
  nodeHighlightBehavior: boolean;
  linkHighlightBehavior: boolean;
  highlightDegree: boolean;
  highlightOpacity: number;
  initialZoom: number;
  maxZoom: number;
  minZoom: number;
  panAndZoom: boolean;
  staticGraph: boolean;
  staticGraphWithDragAndDrop: boolean;
  width: number;
  d3?;
  node?;
  link?;
}

export interface IGraphState {
  id: string;
  config: IGraphConfig;
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
