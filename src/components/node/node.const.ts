import { DEFAULT_CONFIG } from "../graph/graph.config";
import CONST from "../../const";
import { INodeProps } from "./Node.types";

export default {
  ARC: {
    START_ANGLE: 0,
    END_ANGLE: 2 * Math.PI
  },
  DEFAULT_NODE_SIZE: DEFAULT_CONFIG.node.size,
  NODE_LABEL_DX: ".90em",
  NODE_LABEL_DY: ".35em",
  ...CONST
};

export const DEFAULT_NODE_PROPS: Partial<INodeProps> = {
  size: 200,
  nodeStyle: {
    fill: "#d3d3d3"
  },
  labelPosition: "bottom"
};
