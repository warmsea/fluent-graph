import * as d3 from "d3";
import React, { FC, useEffect, useMemo, useReducer, useRef } from "react";
import {
  IGraphBehavior,
  IGraphConfig,
  IGraphNodeDatum,
  IGraphProps,
  IGraphPropsNode
} from "./Graph.types";
import { NodeMap } from "./NodeMap";
import { LinkMatrix } from "./LinkMatrix";
import { throttle } from "lodash";
import { mergeConfig } from "../../utils";
import { DEFAULT_CONFIG } from "./graph.config";
import { NodeModel } from "./NodeModel";
import { LinkModel, getLinkNodeId } from "./LinkModel";
import { LinkMap } from "./LinkMap";
import { INodeCommonConfig } from "../node/Node.types";
import {
  DEFAULT_NODE_PROPS,
  NODE_CLASS_NODE,
  NODE_CLASS_ROOT
} from "../node/Node";
import { ILinkCommonConfig } from "../link/Link.types";
import { DEFAULT_LINK_PROPS } from "../link/Link";
import {
  Drag,
  IZoomState,
  Ref,
  Selection,
  Simulation,
  Zoom
} from "./Graph.types.internal";
import { GraphBehavior } from "./GraphBehavior";
import { useForceUpdate, useStateRef } from "./Graph.hooks";

const GRAPH_CLASS_MAIN: string = "fg-main";
const DISPLAY_DEBOUNCE_MS: number = 50;
const INITIAL_ZOOM: IZoomState = { x: 0, y: 0, k: 1 };

function getTransform(width: number, height: number, zoom: IZoomState): string {
  const x: number = zoom.x + (width / 2) * zoom.k;
  const y: number = zoom.y + (height / 2) * zoom.k;
  return `translate(${x}px,${y}px) scale(${zoom.k})`;
}

function getGraphBehavior(
  ref: Ref<IGraphBehavior> | undefined
): GraphBehavior | undefined {
  if (ref) {
    if (!ref.current) {
      ref.current = new GraphBehavior();
    }
    // Users are not supposed to pass any concrete IGraphBehavior to the ref.
    // And we know we pass GraphBehavior to it.
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
  // The render order decides tab/focus order as well.
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
  const simulationRef: Ref<Simulation | undefined> = useRef();
  const zoomRef: Ref<Zoom> = useRef(d3.zoom());

  const graphId: string = props.id.replace(/ /g, "_");
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
    DISPLAY_DEBOUNCE_MS
  );
  const forceUpdate = useForceUpdate(DISPLAY_DEBOUNCE_MS);

  const nodeMapRef: Ref<NodeMap> = useRef(new NodeMap(zoomStateRef));
  const linkMapRef: Ref<LinkMap> = useRef(new LinkMap());
  const draggingNodeRef: Ref<NodeModel | undefined> = useRef();

  const tick = useMemo(
    () =>
      throttle(() => {
        const nodeMap: NodeMap = nodeMapRef.current;
        nodeMap.getSimulationNodeDatums().forEach(node => {
          const currentNode = nodeMap.get(node.id);
          if (currentNode.isLinkNode) {
            node.x =
              (nodeMap.get(currentNode.relatedNodesOfLinkNode[0]).force.x ??
                0) *
              0.5 +
              (nodeMap.get(currentNode.relatedNodesOfLinkNode[1]).force.x ??
                0) *
              0.5;
            node.y =
              (nodeMap.get(currentNode.relatedNodesOfLinkNode[0]).force.y ??
                0) *
              0.5 +
              (nodeMap.get(currentNode.relatedNodesOfLinkNode[1]).force.y ??
                0) *
              0.5;
          }
        });
        forceUpdate();
      }, DISPLAY_DEBOUNCE_MS),
    [forceUpdate]
  );

  function restartForceSimulation(): void {
    // Stop current simulation if exist
    stopForceSimulation();

    simulationRef.current = d3.forceSimulation(
      nodeMapRef.current.getSimulationNodeDatums()
    );

    simulationRef.current
      .force("charge", d3.forceManyBody().strength(graphConfig.sim.gravity))
      .force(
        "collide",
        d3.forceCollide(node => {
          if (nodeMapRef.current.get((node as IGraphNodeDatum).id).isLinkNode) {
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
      .distance(graphConfig.sim.linkLength)
      .strength(graphConfig.sim.linkStrength);

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

  // Zoom: update min and max zoom scale
  useEffect(() => {
    zoomRef.current.scaleExtent([
      graphConfig.zoom.minZoom,
      graphConfig.zoom.maxZoom
    ]);
  }, [graphConfig.zoom.minZoom, graphConfig.zoom.maxZoom]);
  // Zoom: handle zoom event
  useEffect(() => {
    const zoomBehavior = zoomRef.current;
    zoomBehavior.on("zoom", event => {
      setZoomState(event.transform);
    });
    return () => {
      zoomBehavior.on("zoom", null);
    };
  }, [setZoomState]);
  // Zoom: setup zoom/pan and update behavior ref
  useEffect(() => {
    const zoomSelection: Selection = d3.select(`#${graphContainerId}`);
    zoomSelection.call(zoomRef.current);
    if (!graphConfig.zoom.zoomByScroll) {
      zoomSelection.on("wheel.zoom", null);
    }
    if (!graphConfig.zoom.zoomByDoubleClick) {
      zoomSelection.on("dblclick.zoom", null);
    }
    const behavior = getGraphBehavior(props.behaviorRef);
    behavior?.setupZoomBehavior(zoomSelection, zoomRef);
  }, [graphContainerId, graphConfig.zoom.zoomByScroll, graphConfig.zoom.zoomByDoubleClick, props.behaviorRef]);

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
          transform: getTransform(width, height, zoomState)
        }}
        className={GRAPH_CLASS_MAIN}
      >
        {elements}
      </div>
    </div>
  );
};
