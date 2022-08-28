import * as d3 from "d3";
import React, { FC, useEffect, useMemo, useReducer, useRef } from "react";
import { IGraphBehavior, IGraphConfig, IGraphNodeDatum, IGraphProps } from "./Graph.types";
import { NodeMap } from "./NodeMap";
import { LinkMatrix } from "./LinkMatrix";
import isNumber from "lodash/isNumber";
import throttle from "lodash/throttle";
import { mergeConfig } from "../../utilities";
import { DEFAULT_CONFIG } from "./graph.config";
import { NodeModel } from "./NodeModel";
import { LinkModel } from "./LinkModel";
import { Drag, IZoomState, Ref, Selection, Simulation, Zoom } from "./Graph.types.internal";
import { GraphBehavior } from "./GraphBehavior";
import { useForceUpdate, useStateRef } from "./Graph.hooks";

const GRAPH_CLASS_MAIN = "fg-main";
const DISPLAY_DEBOUNCE_MS = 10;
const INITIAL_ZOOM: IZoomState = { x: 0, y: 0, k: 1 };

function getTransform(width: number, height: number, zoom: IZoomState): string {
  const x: number = zoom.x + (width / 2) * zoom.k;
  const y: number = zoom.y + (height / 2) * zoom.k;
  return `translate(${x}px,${y}px) scale(${zoom.k})`;
}

function getGraphBehavior(ref: Ref<IGraphBehavior | undefined> | undefined): GraphBehavior | undefined {
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
  linkMatrix: LinkMatrix,
  zoomStateRef?: Ref<IZoomState>
) {
  if (!rootId) {
    return <></>;
  }
  const rootNode = nodeMap.get(rootId);
  if (!rootNode) {
    return <></>;
  }

  const elements: React.ReactElement[] = [rootNode.renderNode(zoomStateRef)];
  const queue: NodeModel[] = [rootNode];
  const rendered: Set<NodeModel | LinkModel> = new Set();
  // The render order decides tab/focus order as well.
  while (queue.length > 0) {
    const current: NodeModel | undefined = queue.shift();
    if (current) {
      linkMatrix.forEachWithSource(current.id, (link: LinkModel) => {
        if (!rendered.has(link)) {
          elements.push(link.renderLink());
          rendered.add(link);
        }
        if (!rendered.has(link.targetNode)) {
          elements.push(link.targetNode.renderNode(zoomStateRef));
          rendered.add(link.targetNode);
          queue.push(link.targetNode);
        }
      });
    }
  }
  return elements;
}

export const Graph: FC<IGraphProps> = (props: IGraphProps) => {
  const simulationRef: Ref<Simulation | undefined> = useRef();
  const zoomRef: Ref<Zoom> = useRef(d3.zoom());

  const graphId = props.id.replace(/ /g, "_");
  const graphContainerId = `fg-container-${graphId}`;
  const graphConfig: IGraphConfig = useMemo(() => mergeConfig(DEFAULT_CONFIG, props.config), [props.config]);
  const { width, height } = graphConfig;
  const [topology, increaseTopologyVersion] = useReducer((v) => v + 1, 0);
  const [zoomState, setZoomState, zoomStateRef] = useStateRef(INITIAL_ZOOM, DISPLAY_DEBOUNCE_MS);
  const forceUpdate = useForceUpdate(DISPLAY_DEBOUNCE_MS);

  const nodeConfig = props.nodeConfig ?? {};
  const linkConfig = props.linkConfig ?? {};

  const nodeMapRef: Ref<NodeMap> = useRef(new NodeMap());
  const linkMatrixRef: Ref<LinkMatrix> = useRef(new LinkMatrix());
  const draggingNodeRef: Ref<NodeModel | undefined> = useRef();

  const tick = useMemo(
    () =>
      throttle(() => {
        linkMatrixRef.current.updateCollideNotesPosition();
        forceUpdate();
      }, DISPLAY_DEBOUNCE_MS),
    [forceUpdate]
  );

  function restartForceSimulation(): void {
    // Stop current simulation if exist
    stopForceSimulation();

    simulationRef.current = d3.forceSimulation(
      nodeMapRef.current.getSimNodes().concat(linkMatrixRef.current.getSimCollideNodes())
    );

    simulationRef.current
      .force("charge", d3.forceManyBody().strength(graphConfig.sim.gravity))
      .force(
        "collide",
        d3.forceCollide((node) => {
          if (nodeMapRef.current.get(node.id)) {
            return 50;
          } else {
            return 10;
          }
        })
      )
      .force("center", d3.forceCenter(0, 0).strength(0.01))
      .on("tick", tick);

    const forceLink = d3
      .forceLink(linkMatrixRef.current.getSimLinks())
      .id((node) => (node as IGraphNodeDatum).id)
      .distance(graphConfig.sim.linkLength)
      .strength(graphConfig.sim.linkStrength);

    simulationRef.current.force("link", forceLink);
  }

  function stopForceSimulation(): void {
    simulationRef.current?.stop();
  }

  function setupDrag(): void {
    const dragBehavior: Drag = d3.drag();
    dragBehavior.on("start", (event) => {
      const eventTarget: Element = event.sourceEvent.target;
      // Clicking node should start dragging. Clicking node label should not.
      if (eventTarget.closest(`[data-fg-element=node-draggable-zone]`)) {
        const nodeRoot = eventTarget.closest(`[data-fg-element=node-root]`);
        if (nodeRoot) {
          const draggingNode = nodeMapRef.current.get(nodeRoot.id);
          if (draggingNode && !isNumber(draggingNode.force?.fx) && !isNumber(draggingNode.force?.fy)) {
            draggingNodeRef.current = draggingNode;
            simulationRef.current?.alphaTarget(0.3).restart();
          }
        }
      }
    });
    dragBehavior.on("drag", (event) => {
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
        draggingNodeRef.current = undefined;
        simulationRef.current?.alphaTarget(0).restart();
      }
    });
    const dragSelection: Selection = d3.selectAll(`[data-fg-element=node-root]`);
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
    zoomRef.current.scaleExtent([graphConfig.zoom.minZoom, graphConfig.zoom.maxZoom]);
  }, [graphConfig.zoom.minZoom, graphConfig.zoom.maxZoom]);
  // Zoom: handle zoom event
  useEffect(() => {
    const zoomBehavior = zoomRef.current;
    zoomBehavior.on("zoom", (event) => {
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
    if (!graphConfig.zoom.panByDrag) {
      zoomSelection.on("mousedown.zoom", null);
    }
    if (!graphConfig.zoom.zoomByDoubleClick) {
      zoomSelection.on("dblclick.zoom", null);
    }
    const behavior = getGraphBehavior(props.behaviorRef);
    behavior?.setupZoomBehavior(zoomSelection, zoomRef);
  }, [
    graphContainerId,
    graphConfig.zoom.panByDrag,
    graphConfig.zoom.zoomByScroll,
    graphConfig.zoom.zoomByDoubleClick,
    props.behaviorRef,
  ]);

  const { nodes, links } = props;

  const rootId: string | undefined = nodes.length > 0 ? nodes[0].id : undefined;

  const addedOrRemovedNodes: boolean = nodeMapRef.current.update(nodes, nodeConfig);
  const addedOrRemovedLinks: boolean = linkMatrixRef.current.update(links, linkConfig, nodeMapRef.current);
  if (addedOrRemovedNodes || addedOrRemovedLinks) {
    increaseTopologyVersion();
  }
  const elements = onRenderElements(rootId, nodeMapRef.current, linkMatrixRef.current, zoomStateRef);

  return (
    <div id={graphContainerId} className={props.className} style={{ overflow: "hidden", width, height }}>
      <div
        style={{
          transformOrigin: "0 0",
          transform: getTransform(width, height, zoomState),
        }}
        className={GRAPH_CLASS_MAIN}
      >
        {elements}
      </div>
    </div>
  );
};
