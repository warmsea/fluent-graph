import { noop } from "lodash";
import { zoom } from "d3";
import { IGraphBehavior } from "./Graph.types";
import { Ref, Selection, Zoom } from "./Graph.types.internal";

export class GraphBehavior implements IGraphBehavior {
  public zoomBy: (k: number) => void;
  public resetZoom: () => void;

  constructor() {
    this.zoomBy = noop;
    this.resetZoom = noop;
  }

  public setupZoomBehavior(
    zoomSelection: Selection,
    zoomRef: Ref<Zoom | undefined>,
    disableScrollToZoom?: boolean
  ): void {
    this.zoomBy = (k: number) => {
      zoomRef.current?.scaleBy(zoomSelection, k);
    };
    this.resetZoom = () => {
      zoomRef.current?.scaleTo(zoomSelection, 1);
      zoomRef.current?.translateTo(zoomSelection, 0, 0, [0, 0]);
    };
    if (disableScrollToZoom) {
      zoomSelection.call(zoom).on("wheel.zoom", null);
    }
  }
}
