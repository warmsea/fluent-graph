import * as d3 from "d3";
import { DragBehavior, Selection, ZoomBehavior } from "d3";
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
import { default as CONST } from "./graph.const";
import { LinkMap, IGraphNodeDatum } from "./LinkMap";
import { INodeCommonConfig } from "../node/Node.types";
import { DEFAULT_NODE_PROPS } from "../node/Node";

// Type alias to make the code easier to read
type Ref<T> = MutableRefObject<T>;
type Simulation = d3.Simulation<IGraphNodeDatum, undefined>;
type Zoom = ZoomBehavior<Element, unknown>;

const CLASS_NAME_ROOT_SVG: string = "fg-root-svg";
const DISPLAY_THROTTLE_MS: number = 100;

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
  const nodeMapRef: Ref<NodeMap> = useRef(new NodeMap());
  const linkMapRef: Ref<LinkMap> = useRef(new LinkMap());
  const linkMatrixRef: Ref<LinkMatrix> = useRef(new LinkMatrix());
  const simulationRef: Ref<Simulation | undefined> = useRef();
  const zoomRef: Ref<Zoom | undefined> = useRef();
  const draggingNodeRef: Ref<NodeModel | undefined> = useRef();

  const graphId: string = props.id.replaceAll(/ /g, "_");
  const graphContainerId: string = `fg-container-${graphId}`;
  const graphConfig: IGraphConfig = useMemo(
    () => mergeConfig(DEFAULT_CONFIG, props.config),
    [props.config]
  );
  const nodeConfig: INodeCommonConfig = useMemo(() => {
    return mergeConfig(DEFAULT_NODE_PROPS, props.nodeConfig);
  }, [props.nodeConfig]);
  const { width, height } = graphConfig;

  const [zoomState, setZoomState] = useState({ x: 0, y: 0, k: 1 });
  const throttledSetZoomState = throttle(setZoomState, DISPLAY_THROTTLE_MS);

  // @ts-ignore: Unused locals
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  const tick = useCallback(
    throttle(() => {
      const radius: number =
        graphConfig.d3.paddingRadius || DEFAULT_NODE_PROPS.size! / 2;
      // constrain nodes from exceed the border of the graph.
      nodeMap.getSimulationNodeDatums().forEach(node => {
        node.x = Math.max(radius, Math.min(width - radius, node.x || radius));
        node.y = Math.max(radius, Math.min(height - radius, node.y || radius));
      });
      forceUpdate();
    }, DISPLAY_THROTTLE_MS),
    []
  );

  // Force simulation behavior
  useEffect(() => {
    if (!simulationRef.current) {
      simulationRef.current = d3.forceSimulation(
        nodeMap.getSimulationNodeDatums()
      );

      simulationRef.current
        .force("charge", d3.forceManyBody().strength(graphConfig.d3.gravity))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force(
          "collide",
          d3.forceCollide().radius(graphConfig.d3.collideRadius)
        )
        .on("tick", tick);

      const forceLink = d3
        .forceLink(linkMap.getSimulationLinkDatums())
        .id(node => (node as IGraphNodeDatum).id)
        .distance(graphConfig.d3.linkLength)
        .strength(graphConfig.d3.linkStrength);

      simulationRef.current.force(CONST.LINK_CLASS_NAME, forceLink);
      // TODO stop simulation earlier?
    }
  });

  // Zoom and pan behavior
  useEffect(() => {
    if (!zoomRef.current) {
      const zoomSelection: Selection<
        Element,
        unknown,
        Element,
        unknown
      > = d3.select(`#${graphContainerId}`);
      const zoomBehavior = d3.zoom();
      zoomRef.current = zoomBehavior;
      zoomSelection.call(zoomBehavior);
    }
    zoomRef.current.scaleExtent([graphConfig.minZoom, graphConfig.maxZoom]);
    zoomRef.current.on("zoom", event => {
      throttledSetZoomState(event.transform);
    });
  }, [
    graphContainerId,
    graphConfig.minZoom,
    graphConfig.maxZoom,
    throttledSetZoomState
  ]);

  // Drag and drop behavior
  useEffect(() => {
    const dragBehavior: DragBehavior<SVGElement, unknown, unknown> = d3.drag();
    dragBehavior.on("start", event => {
      simulationRef.current?.stop();
      for (const element of event.sourceEvent.path) {
        if (element.matches?.(".fg-node")) {
          draggingNodeRef.current = nodeMapRef.current.get(
            element.dataset.nodeid
          );
          return;
        }
      }
      draggingNodeRef.current = undefined;
    });
    dragBehavior.on("drag", event => {
      // TODO logic here works but not reasonable
      if (draggingNodeRef.current?.force) {
        draggingNodeRef.current.force.x += event.x;
        draggingNodeRef.current.force.y += event.y;
        forceUpdate();
      }
    });
    dragBehavior.on("end", () => {
      draggingNodeRef.current = undefined;
      simulationRef.current?.alpha(1);
      simulationRef.current?.restart();
    });
    (d3.selectAll(".fg-node") as any).call(dragBehavior);
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
  const linkMap: LinkMap = linkMapRef.current;
  const linkMatrix: LinkMatrix = linkMatrixRef.current;

  nodeMap.updateNodeMap(props.nodes, nodeConfig);
  linkMap.updateLinkMap(props.links, nodeMap, props.linkConfig);
  linkMatrix.updateMatrix(props.links, props.linkConfig || {}, nodeMap);
  const elements = onRenderElements(rootId, nodeMap, linkMatrix);

  return (
    <div id={graphContainerId}>
      <svg
        width={width}
        height={height}
        className={CLASS_NAME_ROOT_SVG}
        viewBox={calcViewBox(
          width,
          height,
          zoomState.x,
          zoomState.y,
          zoomState.k
        )}
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
