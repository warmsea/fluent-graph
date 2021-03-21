import * as d3 from 'd3';
import React, { FC, MutableRefObject, useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import {
  IGraphConfig,
  IGraphProps,
} from "./Graph.types";
import { NodeMap } from './NodeMap';
import { LinkMatrix } from './LinkMatrix';
import { throttle } from 'lodash';
import { mergeConfig } from '../../utils';
import { DEFAULT_CONFIG } from './graph.config';
import { NodeModel } from './NodeModel';
import { LinkModel } from './LinkModel';

const CLASS_NAME_ROOT_SVG: string = "fg-root-svg";

export const Graph: FC<IGraphProps> = (props: IGraphProps) => {
  const nodeMapRef: MutableRefObject<NodeMap> = useRef(new NodeMap());
  const linkMatrixRef: MutableRefObject<LinkMatrix> = useRef(new LinkMatrix());
  const simulationRef: MutableRefObject<d3.Simulation<d3.SimulationNodeDatum, undefined> | undefined> = useRef();

  // @ts-ignore: Unused locals
  const [ignored, forceUpdateDispatch] = useReducer(x => x + 1, 0);

  const forceUpdate = throttle(forceUpdateDispatch, 50);

  const graphConfig: IGraphConfig = useMemo(
    () => mergeConfig(DEFAULT_CONFIG, props.config),
    [props.config]
  );

  useEffect(() => {
    if (!simulationRef.current) {
      simulationRef.current = d3.forceSimulation(nodeMap.getSimulationNodeDatums());
      simulationRef.current
        .force("charge", d3.forceManyBody())
        .on('tick', forceUpdate);
      // TODO stop simulation earlier
    }
  });

  const onClickGraph = useCallback(event => {
    // TODO pause animation?
    if (
      (event.target as SVGSVGElement)?.classList.contains(CLASS_NAME_ROOT_SVG)
    ) {
      props.onClickGraph?.(event);
    }
  }, []);

  const rootId: string | undefined = props.nodes.length > 0 ? props.nodes[0].id : undefined;
  const nodeMap: NodeMap = nodeMapRef.current;
  const linkMatrix: LinkMatrix = linkMatrixRef.current;
  const { width, height } = graphConfig;

  nodeMap.updateNodeMap(props.nodes, props.nodeConfig || {});
  linkMatrix.updateMatrix(props.links, props.linkConfig || {}, nodeMap);
  const elements = onRenderElements(rootId, nodeMap, linkMatrix);

  return (
    <div>
      <svg
        width={width}
        height={height}
        className={CLASS_NAME_ROOT_SVG}
        viewBox={`${-width / 2},${-height / 2},${width},${height}`}
        onClick={onClickGraph}
      >
        <g>
          {elements}
        </g>
      </svg>
    </div>
  );
};

export function onRenderElements(rootId: string | undefined, nodeMap: NodeMap, linkMatrix: LinkMatrix): JSX.Element {
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
