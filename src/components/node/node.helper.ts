/**
 * @module Node/helper
 * @description
 * Some methods that help no the process of rendering a node.
 */
import { ILabelPlacementProps, LabelPosition } from "./Node.types";

const NODE_LABEL_DX: string = ".90em";
const NODE_LABEL_DY: string = ".35em";

/**
 * return dx, dy, and potentially alignmentBaseline and textAnchor props to put label in correct position relative to node
 * @param {number | undefined} dx - default computed offset of label to the right of the node
 * @param {'left' | 'right' | 'top' | 'bottom' | 'center' | undefined} labelPosition - user specified position of label relative to node
 * @returns {{dx: string, dy: string} | {dx: string, dy: string, textAnchor: string, dominantBaseline: string}}
 * props to put text svg for label in correct spot. default case returns just dx and dy, without textAnchor and dominantBaseline
 * @memberof Node/helper
 */
export function getLabelPlacementProps(
  labelPosition?: LabelPosition,
  dx?: number
): ILabelPlacementProps {
  switch (labelPosition) {
    case "right":
      return {
        dx: dx ? `${dx}` : NODE_LABEL_DX,
        dy: "0",
        dominantBaseline: "middle",
        textAnchor: "start"
      };
    case "left":
      return {
        dx: dx ? `${-dx}` : `-${NODE_LABEL_DX}`,
        dy: "0",
        dominantBaseline: "middle",
        textAnchor: "end"
      };
    case "top":
      return {
        dx: "0",
        dy: dx ? `${-dx}` : `-${NODE_LABEL_DX}`,
        dominantBaseline: "baseline",
        textAnchor: "middle"
      };
    case "bottom":
      return {
        dx: "0",
        dy: dx ? `${dx}` : NODE_LABEL_DX,
        dominantBaseline: "hanging",
        textAnchor: "middle"
      };
    case "center":
      return {
        dx: "0",
        dy: "0",
        dominantBaseline: "middle",
        textAnchor: "middle"
      };
    default:
      return {
        dx: dx ? `${dx}` : NODE_LABEL_DX,
        dy: NODE_LABEL_DY
      };
  }
}
