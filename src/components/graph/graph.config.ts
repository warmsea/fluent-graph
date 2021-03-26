import { IGraphConfig } from "./Graph.types";

export const DEFAULT_CONFIG: IGraphConfig = {
  automaticRearrangeAfterDropNode: false,
  freezeAllDragEvents: false,
  focusAnimationDuration: 0.75,
  focusZoom: 1,
  height: 700,
  maxZoom: 8,
  minZoom: 0.125,
  initialZoom: undefined,
  panAndZoom: false,
  staticGraph: false,
  staticGraphWithDragAndDrop: false,
  width: 800,
  d3: {
    alphaTarget: 0.05,
    gravity: -100,
    linkLength: 100,
    linkStrength: 1,
    disableLinkForce: false,
    paddingRadius: 30
  }
};
