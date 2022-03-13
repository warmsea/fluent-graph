import noop from "lodash/noop";
import { IGraphBehavior } from "./Graph.types";
import { Ref, Selection, Zoom } from "./Graph.types.internal";

export class GraphBehavior implements IGraphBehavior {
  public zoomBy: (k: number) => void;
  public resetZoom: () => void;

  constructor() {
    this.zoomBy = noop;
    this.resetZoom = noop;
  }

  public setupZoomBehavior(zoomSelection: Selection, zoomRef: Ref<Zoom | undefined>): void {
    this.zoomBy = (k: number) => {
      zoomRef.current?.scaleBy(zoomSelection, k);
    };
    this.resetZoom = () => {
      zoomRef.current?.scaleTo(zoomSelection, 1);
      zoomRef.current?.translateTo(zoomSelection, 0, 0, [0, 0]);
    };
  }
}
