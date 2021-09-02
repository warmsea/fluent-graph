import { IGraphConfig } from "./Graph.types";

export const DEFAULT_CONFIG: IGraphConfig = {
  height: 700,
  width: 800,
  sim: {
    gravity: -100,
    linkLength: 100,
    linkStrength: 1,
    paddingRadius: 30
  },
  zoom: {
    initialZoom: 1,
    maxZoom: 8,
    minZoom: 0.125,
    zoomByScroll: true,
    zoomByDoubleClick: true
  }
};
