import * as d3 from "d3";
import React, {
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from "react";
import { IGraphConfig, IGraphProps } from "./Graph.types";
import { NodeMap } from "./NodeMap";
import { LinkMatrix } from "./LinkMatrix";
import { throttle } from "lodash";
import { mergeConfig } from "../../utils";
import { DEFAULT_CONFIG } from "./graph.config";
import { NodeModel } from "./NodeModel";
import { LinkModel } from "./LinkModel";

const CLASS_NAME_ROOT_SVG: string = "fg-root-svg";

export function calcViewBox(
  width: number,
  height: number,
  x: number,
  y: number,
  zoom: number
): string {
  return `${-x / zoom},${-y / zoom},${width / zoom},${height / zoom}`;
}

export const Graph: FC<IGraphProps> = (props: IGraphProps) => {
  const nodeMapRef: MutableRefObject<NodeMap> = useRef(new NodeMap());
  const linkMatrixRef: MutableRefObject<LinkMatrix> = useRef(new LinkMatrix());
  const simulationRef: MutableRefObject<
    d3.Simulation<d3.SimulationNodeDatum, undefined> | undefined
  > = useRef();

  const graphId: string = props.id.replaceAll(/ /g, "_");
  const graphConfig: IGraphConfig = useMemo(
    () => mergeConfig(DEFAULT_CONFIG, props.config),
    [props.config]
  );
  const { width, height } = graphConfig;

  // @ts-ignore: Unused locals
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ignored, forceUpdateDispatch] = useReducer(x => x + 1, 0);
  const forceUpdate = throttle(forceUpdateDispatch, 50);

  const [viewBox, setViewBox] = useState(() => {
    return calcViewBox(graphConfig.width, graphConfig.height, 0, 0, 1);
  });
  const handleZoom = throttle((x, y, k) => {
    const viewBox = calcViewBox(graphConfig.width, graphConfig.height, x, y, k);
    setViewBox(viewBox);
  }, 50);

  useEffect(() => {
    if (!simulationRef.current) {
      simulationRef.current = d3.forceSimulation(
        nodeMap.getSimulationNodeDatums()
      );
      simulationRef.current
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", forceUpdate);
      // TODO stop simulation earlier
    }
  });

  useEffect(() => {
    const zoomSelection = d3.select(`#fg-container-${graphId}`);

    const zoomBehavior = d3.zoom();
    zoomBehavior.scaleExtent([graphConfig.minZoom, graphConfig.maxZoom]);
    zoomBehavior.on("zoom", event => {
      handleZoom(event.transform.x, event.transform.y, event.transform.k);
    });

    zoomSelection.call(zoomBehavior as any);
  }, []);

  const onClickGraph = useCallback(
    event => {
      // TODO pause animation?
      if (
        (event.target as SVGSVGElement)?.classList.contains(CLASS_NAME_ROOT_SVG)
      ) {
        props.onClickGraph?.(event);
      }
    },
    [props.onClickGraph]
  );

  const rootId: string | undefined =
    props.nodes.length > 0 ? props.nodes[0].id : undefined;
  const nodeMap: NodeMap = nodeMapRef.current;
  const linkMatrix: LinkMatrix = linkMatrixRef.current;

  nodeMap.updateNodeMap(props.nodes, props.nodeConfig || {});
  linkMatrix.updateMatrix(props.links, props.linkConfig || {}, nodeMap);
  const elements = onRenderElements(rootId, nodeMap, linkMatrix);

  return (
    <div id={`fg-container-${graphId}`}>
      <svg
        id={`fg-svg:${graphId}`}
        width={width}
        height={height}
        className={CLASS_NAME_ROOT_SVG}
        viewBox={viewBox}
        onClick={onClickGraph}
      >
        <g>{elements}</g>
      </svg>
    </div>
  );
};

export function onRenderElements(
  rootId: string | undefined,
  nodeMap: NodeMap,
  linkMatrix: LinkMatrix
): JSX.Element {
  if (!rootId) {
    return <></>;
  }

  const elements: JSX.Element[] = [nodeMap.get(rootId).renderNode()];
  const queue: NodeModel[] = [nodeMap.get(rootId)];
  const rendered: Set<NodeModel | LinkModel> = new Set();
  while (queue.length > 0) {
    const current: NodeModel = queue.shift()!;
    linkMatrix.forEachWithSource(current.id, (link: LinkModel) => {
      if (!rendered.has(link)) {
        elements.push(link.renderLink());
        rendered.add(link);
      }
      if (!rendered.has(link.targetNode)) {
        elements.push(link.targetNode.renderNode());
        rendered.add(link.targetNode);
        queue.push(link.targetNode);
      }
    });
  }
  return <>{elements}</>;
}
