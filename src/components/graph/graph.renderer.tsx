/**
 * @module Graph/renderer
 * @description
 * Offers a series of methods that isolate render logic for Graph component.
 */
import React from "react";

import CONST from "./graph.const";
import { Link } from "../link/Link";
import { Node } from "../node/Node";
import { buildLinkProps, buildNodeProps } from "./graph.builder";
import { getId } from "./graph.helper";

/**
 * Function that builds Graph with Breadth First Search.
 * @param {Object.<string, Object>} nodes - an object containing all nodes mapped by their id.
 * @param {Function[]} nodeCallbacks - array of callbacks for used defined event handler for node interactions.
 * @param {Object} config - an object containing rd3g consumer defined configurations {@link #config config} for the graph.
 * @param {number} transform - value that indicates the amount of zoom transformation.
 * @param {Array.<Object>} linksMatrix - array of links {@link #Link|Link}.
 * @param {Array.<Object>} links - array of links {@link #Link|Link}.
 * @param {Function[]} linkCallbacks - same as {@link #graphrenderer|linkCallbacks in renderGraph}.
 */
function renderWithBFS(
  nodes,
  nodeCallbacks,
  config,
  transform,
  linksMatrix,
  links,
  linkCallbacks
) {
  function _renderNode(nodeId) {
    const props = buildNodeProps(
      { ...nodes[nodeId], id: `${nodeId}` },
      config,
      nodeCallbacks,
      transform
    );

    return <Node key={nodeId} {...props} />;
  }

  function _renderLink(link) {
    const { source, target } = link;
    const sourceId = getId(source);
    const targetId = getId(target);
    const key = `${sourceId}${CONST.COORDS_SEPARATOR}${targetId}`;
    const props = buildLinkProps(
      { ...link, source: `${sourceId}`, target: `${targetId}` },
      nodes,
      linksMatrix,
      config,
      linkCallbacks,
      transform
    );

    return <Link key={key} id={key} {...props} />;
  }

  const visitedNodeIds: string[] = [];
  const visitedLinks = [];
  const elements: JSX.Element[] = [];

  const startNodeId = nodes[Object.keys(nodes)[0]].id;
  elements.push(_renderNode(startNodeId));
  visitedNodeIds.push(startNodeId);

  bfs(
    elements,
    visitedNodeIds,
    visitedLinks,
    nodes,
    startNodeId,
    _renderNode,
    links,
    _renderLink
  );

  return elements;
}

function bfs(
  elements,
  visitedNodeIds,
  visitedLinks,
  nodes,
  nodeId,
  nodeRenderer,
  links,
  linkRenderer
) {
  if (
    visitedLinks.length === links.length &&
    visitedNodeIds.length === Object.keys(nodes).length
  ) {
    return;
  }

  const linksToRender = links
    .filter(
      link => getId(link.source) === nodeId || getId(link.target) === nodeId
    )
    .filter(link => {
      return (
        visitedLinks.filter(
          visitedLink =>
            visitedLink.source === link.source &&
            visitedLink.target === link.target
        ).length === 0
      );
    });

  linksToRender.forEach(link => {
    elements.push(linkRenderer(link));
    const connectedNodeId =
      getId(link.source) === nodeId ? getId(link.target) : getId(link.source);
    if (
      visitedNodeIds.filter(visitedNodeId => visitedNodeId === connectedNodeId)
        .length === 0
    ) {
      elements.push(nodeRenderer(connectedNodeId));
      visitedNodeIds.push(connectedNodeId);
    }
  });
  visitedLinks.push(...linksToRender);

  const nextLayerNodeIds = linksToRender.map(link => {
    return getId(link.source) === nodeId
      ? getId(link.target)
      : getId(link.source);
  });

  nextLayerNodeIds.forEach(nodeId =>
    bfs(
      elements,
      visitedNodeIds,
      visitedLinks,
      nodes,
      nodeId,
      nodeRenderer,
      links,
      linkRenderer
    )
  );
}

export { renderWithBFS };
