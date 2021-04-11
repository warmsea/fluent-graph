import * as d3 from "d3";
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef
} from "react";
import {
  IGraphBehavior,
  IGraphConfig,
  IGraphProps,
  IGraphPropsNode
} from "./Graph.types";
import { NodeMap } from "./NodeMap";
import { LinkMatrix } from "./LinkMatrix";
import { clamp, throttle } from "lodash";
import { mergeConfig } from "../../utils";
import { DEFAULT_CONFIG } from "./graph.config";
import { NodeModel } from "./NodeModel";
import { LinkModel, getLinkNodeId } from "./LinkModel";
import { default as CONST } from "./graph.const";
import { LinkMap, IGraphNodeDatum } from "./LinkMap";
import { INodeCommonConfig } from "../node/Node.types";
import {
  DEFAULT_NODE_PROPS,
  NODE_CLASS_NODE,
  NODE_CLASS_ROOT
} from "../node/Node";
import { ILinkCommonConfig } from "../link/Link.types";
import { DEFAULT_LINK_PROPS } from "../link/Link";
import { Drag, Ref, Selection, Simulation, Zoom } from "./Graph.types.internal";
import { GraphBehavior } from "./GraphBehavior";
import { useForceUpdate, useStateRef } from "./Graph.hooks";

const GRAPH_CLASS_MAIN: string = "fg-main";
const DISPLAY_THROTTLE_MS: number = 50;
const INITIAL_ZOOM = { x: 0, y: 0, k: 1 };

function getGraphBehavior(
  ref: Ref<IGraphBehavior> | undefined
): GraphBehavior | undefined {
  if (ref) {
    if (!ref.current) {
      ref.current = new GraphBehavior();
    }
    return ref.current as GraphBehavior;
  } else {
    return undefined;
  }
}

function onRenderElements(
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
  const [zoomState, setZoomState, zoomStateRef] = useStateRef(
    INITIAL_ZOOM,
    DISPLAY_THROTTLE_MS
  );
  const forceUpdate = useForceUpdate(DISPLAY_THROTTLE_MS);

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
          node.x = clamp(
            node.x ?? 0,
            Math.min(radius, width - radius),
            Math.max(radius, width - radius)
          );
          node.y = clamp(
            node.y ?? 0,
            Math.min(radius, height - radius),
            Math.max(radius, height - radius)
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

    simulationRef.current.force("link", forceLink);
  }

  function stopForceSimulation(): void {
    simulationRef.current?.stop();
  }

  function setupDrag(): void {
    const dragBehavior: Drag = d3.drag();
    dragBehavior.on("start", event => {
      const eventTarget: Element = event.sourceEvent.target;
      // Clicking node should start dragging. Clicking node label should not.
      if (eventTarget.closest(`.${NODE_CLASS_NODE}`)) {
        const nodeRoot = eventTarget.closest(`.${NODE_CLASS_ROOT}`);
        if (nodeRoot) {
          draggingNodeRef.current = nodeMapRef.current.get(nodeRoot.id);
          simulationRef.current?.alphaTarget(0.3).restart();
        }
      }
    });
    dragBehavior.on("drag", event => {
      const force = draggingNodeRef.current?.force;
      if (force) {
        force.fx = event.x / zoomStateRef.current.k;
        force.fy = event.y / zoomStateRef.current.k;
        forceUpdate();
      }
    });
    dragBehavior.on("end", () => {
      const force = draggingNodeRef.current?.force;
      if (force) {
        force.fx = force.fy = undefined;
      }
      draggingNodeRef.current = undefined;
      simulationRef.current?.alphaTarget(0).restart();
    });
    const dragSelection: Selection = d3.selectAll(`.${NODE_CLASS_ROOT}`);
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
      zoomRef.current = d3.zoom();
    }
    zoomRef.current.on("zoom", event => {
      setZoomState(event.transform);
    });
    const zoomSelection: Selection = d3.select(`#${graphContainerId}`);
    zoomSelection.call(zoomRef.current);
    const behavior = getGraphBehavior(props.behaviorRef);
    behavior?.setupZoomBehavior(zoomSelection, zoomRef);
  }, [graphContainerId, props.behaviorRef, setZoomState]);

  // Update zoom behavior on config change
  useEffect(() => {
    zoomRef.current?.scaleExtent([graphConfig.minZoom, graphConfig.maxZoom]);
  }, [graphConfig.minZoom, graphConfig.maxZoom]);

  const onClickGraph = useCallback(
    event => {
      if ((event.target as HTMLElement)?.classList.contains(GRAPH_CLASS_MAIN)) {
        props.onClickGraph?.(event);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div id={graphContainerId} style={{ overflow: "hidden", width, height }}>
      <div
        style={{
          transformOrigin: "0 0",
          transform: `translate(${zoomState.x}px,${zoomState.y}px) scale(${zoomState.k})`
        }}
        className={GRAPH_CLASS_MAIN}
        onClick={onClickGraph}
      >
        {elements}
      </div>
    </div>
  );
};
