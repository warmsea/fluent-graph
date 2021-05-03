import { DragBehavior, ZoomBehavior } from "d3";
import { MutableRefObject } from "react";
import { IGraphNodeDatum } from './Graph.types';

// Type alias to make the code easier to read
export type Drag = DragBehavior<Element, unknown, unknown>;
export type Ref<T> = MutableRefObject<T>;
export type Selection = d3.Selection<Element, unknown, Element, unknown>;
export type Simulation = d3.Simulation<IGraphNodeDatum, undefined>;
export type Zoom = ZoomBehavior<Element, unknown>;

export interface IZoomState {
  x: number;
  y: number;
  k: number;
}
