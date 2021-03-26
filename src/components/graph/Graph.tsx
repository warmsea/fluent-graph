import * as d3 from "d3";
import { DragBehavior, ZoomBehavior } from "d3";
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
import { IGraphConfig, IGraphProps, IGraphPropsNode } from "./Graph.types";
import { NodeMap } from "./NodeMap";
import { LinkMatrix } from "./LinkMatrix";
import { throttle } from "lodash";
import { mergeConfig } from "../../utils";
import { DEFAULT_CONFIG } from "./graph.config";
import { NodeModel } from "./NodeModel";
import { LinkModel, getLinkNodeId } from "./LinkModel";
import { default as CONST } from "./graph.const";
import { LinkMap, IGraphNodeDatum } from "./LinkMap";
import { INodeCommonConfig } from "../node/Node.types";
import { DEFAULT_NODE_PROPS } from "../node/Node";
import { ILinkCommonConfig } from "../link/Link.types";
import { DEFAULT_LINK_PROPS } from "../link/Link";

// Type alias to make the code easier to read
type Drag = DragBehavior<Element, unknown, unknown>;
type Ref<T> = MutableRefObject<T>;
type Selection = d3.Selection<Element, unknown, Element, unknown>;
type Simulation = d3.Simulation<IGraphNodeDatum, undefined>;
type Zoom = ZoomBehavior<Element, unknown>;

const CLASS_NAME_ROOT_SVG: string = "fg-root-svg";
const DISPLAY_THROTTLE_MS: number = 50;

export function calcZoomLevel(x: number, y: number, zoom: number): string {
  return `scale(${zoom}) translate(${x}px,${y}px)`;
}

export const Graph: FC<IGraphProps> = (props: IGraphProps) => {
  const nodeMapRef: Ref<NodeMap> = useRef(new NodeMap());
  const linkMapRef: Ref<LinkMap> = useRef(new LinkMap());
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
  const linkConfig: ILinkCommonConfig = useMemo(() => {
    return mergeConfig(DEFAULT_LINK_PROPS, props.linkConfig);
  }, [props.linkConfig]);
  const { width, height } = graphConfig;

  const [topology, increaseTopologyVersion] = useReducer(v => v + 1, 0);
  const [zoomState, setZoomState] = useState({ x: 0, y: 0, k: 1 });
  const throttledSetZoomState = throttle(setZoomState, DISPLAY_THROTTLE_MS);

  // @ts-ignore: Unused locals
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ignored, forceUpdate] = useReducer(v => v + 1, 0);

  const tick = useCallback(
    throttle(() => {
      const radius: number =
        graphConfig.d3.paddingRadius || DEFAULT_NODE_PROPS.size! / 2;
      // constrain nodes from exceed the border of the graph.
      const nodeMap: NodeMap = nodeMapRef.current;
      nodeMap.getSimulationNodeDatums().forEach(node => {
        if (node.id.indexOf(CONST.LINK_NODE_PREFIX) !== -1) {
          node.x =
            (nodeMap.get(node.id.split("-")[1]).force.x ?? 0) * 0.5 +
            (nodeMap.get(node.id.split("-")[2]).force.x ?? 0) * 0.5;
          node.y =
            (nodeMap.get(node.id.split("-")[1]).force.y ?? 0) * 0.5 +
            (nodeMap.get(node.id.split("-")[2]).force.y ?? 0) * 0.5;
        } else {
          node.x = Math.max(radius, Math.min(width - radius, node.x || radius));
          node.y = Math.max(
            radius,
            Math.min(height - radius, node.y || radius)
          );
        }
      });
      forceUpdate();
    }, DISPLAY_THROTTLE_MS),
    []
  );

  function restartForceSimulation(): void {
    // Stop current simulation if exist
    stopForceSimulation();

    simulationRef.current = d3.forceSimulation(
      nodeMapRef.current.getSimulationNodeDatums()
    );

    simulationRef.current
      .force("charge", d3.forceManyBody().strength(graphConfig.d3.gravity))
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.1))
      .force(
        "collide",
        d3.forceCollide(node => {
          if (
            (node as IGraphNodeDatum).id.indexOf(CONST.LINK_NODE_PREFIX) !== -1
          ) {
            return 10;
          } else {
            return 50;
          }
        })
      )
      .on("tick", tick);

    const forceLink = d3
      .forceLink(linkMapRef.current.getSimulationLinkDatums())
      .id(node => (node as IGraphNodeDatum).id)
      .distance(graphConfig.d3.linkLength)
      .strength(graphConfig.d3.linkStrength);

    simulationRef.current.force(CONST.LINK_CLASS_NAME, forceLink);
  }

  function stopForceSimulation(): void {
    simulationRef.current?.stop();
  }

  function setupDrag(): void {
    const dragBehavior: Drag = d3.drag();
    dragBehavior.on("start", event => {
      // TODO don't stop the drag but fix this node only
      stopForceSimulation();
      for (const element of event.sourceEvent.path) {
        if (element.matches?.(".fg-node")) {
          draggingNodeRef.current = nodeMapRef.current.get(element.id);
          return;
        }
      }
      draggingNodeRef.current = undefined;
    });
    dragBehavior.on("drag", event => {
      // TODO logic here works but not reasonable
      if (draggingNodeRef.current?.force) {
        draggingNodeRef.current.force.x = event.x;
        draggingNodeRef.current.force.y = event.y;
        forceUpdate();
      }
    });
    dragBehavior.on("end", () => {
      draggingNodeRef.current = undefined;
      simulationRef.current?.alpha(1);
      simulationRef.current?.restart();
    });
    const dragSelection: Selection = d3.selectAll(".fg-node");
    dragSelection.call(dragBehavior);
  }

  useEffect(
    () => {
      restartForceSimulation();
      setupDrag();

      return () => {
        stopForceSimulation();
        // No need to clean up drag
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [topology]
  );

  // Zoom and pan behavior
  useEffect(() => {
    if (!zoomRef.current) {
      const zoomBehavior = d3.zoom();
      zoomRef.current = zoomBehavior;
      const zoomSelection: Selection = d3.select(`#${graphContainerId}`);
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

  const nodes: IGraphPropsNode[] = props.nodes.concat(
    props.links.map(link => {
      return { id: getLinkNodeId(link) };
    })
  );
  const addedOrRemovedNodes: boolean = nodeMapRef.current.updateNodeMap(
    nodes,
    nodeConfig,
    props.links
  );
  const addedOrRemovedLinks: boolean = linkMapRef.current.updateLinkMap(
    props.links,
    linkConfig,
    nodeMapRef.current
  );
  if (addedOrRemovedNodes || addedOrRemovedLinks) {
    increaseTopologyVersion();
  }
  const elements = onRenderElements(
    rootId,
    nodeMapRef.current,
    new LinkMatrix(props.links, linkMapRef.current, nodeMapRef.current)
  );

  return (
    <div id={graphContainerId}>
      <div
        style={{
          position: "relative",
          width,
          height,
          transform: calcZoomLevel(zoomState.x, zoomState.y, zoomState.k)
        }}
        className={CLASS_NAME_ROOT_SVG}
        onClick={onClickGraph}
      >
        {elements}
      </div>
    </div>
  );
};

export function onRenderElements(
  rootId: string | undefined,
  nodeMap: NodeMap,
  linkMatrix: LinkMatrix
) {
  if (!rootId) {
    return <></>;
  }

  const elements: React.ReactNode[] = [nodeMap.get(rootId).renderNode()];
  const queue: NodeModel[] = [nodeMap.get(rootId)];
  const rendered: Set<NodeModel | LinkModel> = new Set();
  while (queue.length > 0) {
    const current: NodeModel = queue.shift()!;
    linkMatrix.forEachWithSource(current.id, (link: LinkModel) => {
      if (!rendered.has(link)) {
        elements.push(link.renderLink());
        rendered.add(link);
        elements.push(link.renderLinkNode());
      }
      if (!rendered.has(link.targetNode)) {
        elements.push(link.targetNode.renderNode());
        rendered.add(link.targetNode);
        queue.push(link.targetNode);
      }
    });
  }
  return elements;
}
