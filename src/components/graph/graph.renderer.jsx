/**
 * @module Graph/renderer
 * @description
 * Offers a series of methods that isolate render logic for Graph component.
 */
import React from "react";

import CONST from "./graph.const";
import { MARKERS } from "../marker/marker.const";

import Link from "../link/Link";
import Node from "../node/Node";
import Marker from "../marker/Marker";
import { buildLinkProps, buildNodeProps } from "./graph.builder";
import { getId } from "../graph/graph.helper";
import { isNodeVisible } from "./collapse.helper";
import { getMarkerSize } from "../marker/marker.helper";

/**
 * Function that builds Graph with Breadth First Search.
 * @param {Object.<string, Object>} nodes - an object containing all nodes mapped by their id.
 * @param {Function[]} nodeCallbacks - array of callbacks for used defined event handler for node interactions.
 * @param {Object} config - an object containing rd3g consumer defined configurations {@link #config config} for the graph.
 * @param {string} highlightedNode - this value contains a string that represents the some currently highlighted node.
 * @param {Object} highlightedLink - this object contains a source and target property for a link that is highlighted at some point in time.
 * @param {number} transform - value that indicates the amount of zoom transformation.
 * @param {Array.<Object>} linksMatrix - array of links {@link #Link|Link}.
 * @param {Array.<Object>} links - array of links {@link #Link|Link}.
 * @param {Function[]} linkCallbacks - same as {@link #graphrenderer|linkCallbacks in renderGraph}.
 */
function renderWithBFS(
    nodes,
    nodeCallbacks,
    config,
    highlightedNode,
    highlightedLink,
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
            highlightedNode,
            highlightedLink,
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
            `${highlightedNode}`,
            highlightedLink,
            transform
        );

        return <Link key={key} id={key} {...props} />;
    }

    const visitedNodeIds = [];
    const visitedLinks = [];
    const elements = [];

    const startNodeId = nodes[Object.keys(nodes)[0]].id;
    elements.push(_renderNode(startNodeId));
    visitedNodeIds.push(startNodeId);

    bfs(elements, visitedNodeIds, visitedLinks, nodes, startNodeId, _renderNode, links, _renderLink);

    return elements;
}

function bfs(elements, visitedNodeIds, visitedLinks, nodes, nodeId, nodeRenderer, links, linkRenderer) {
    if (visitedLinks.length === links.length && visitedNodeIds.length === Object.keys(nodes).length) {
        return;
    }

    const linksToRender = links
        .filter(link => getId(link.source) === nodeId || getId(link.target) === nodeId)
        .filter(link => {
            return (
                visitedLinks.filter(
                    visitedLink => visitedLink.source === link.source && visitedLink.target === link.target
                ).length === 0
            );
        });

    linksToRender.forEach(link => {
        elements.push(linkRenderer(link));
        const connectedNodeId = getId(link.source) === nodeId ? getId(link.target) : getId(link.source);
        if (visitedNodeIds.filter(visitedNodeId => visitedNodeId === connectedNodeId).length === 0) {
            elements.push(nodeRenderer(connectedNodeId));
            visitedNodeIds.push(connectedNodeId);
        }
    });
    visitedLinks.push(...linksToRender);

    const nextLayerNodeIds = linksToRender.map(link => {
        return getId(link.source) === nodeId ? getId(link.target) : getId(link.source);
    });

    nextLayerNodeIds.forEach(nodeId =>
        bfs(elements, visitedNodeIds, visitedLinks, nodes, nodeId, nodeRenderer, links, linkRenderer)
    );
}

/**
 * Builds graph defs (for now markers, but we could also have gradients for instance).
 * NOTE: defs are static svg graphical objects, thus we only need to render them once, the result
 * is cached on the 1st call and from there we simply return the cached jsx.
 * @returns {Function} memoized build definitions function.
 * @memberof Graph/renderer
 */
function _renderDefs() {
    let cachedDefs;

    return config => {
        if (cachedDefs) {
            return cachedDefs;
        }

        const { small, medium, large } = getMarkerSize(config);
        const markerProps = {
            markerWidth: config.link.markerWidth,
            markerHeight: config.link.markerHeight,
        };

        cachedDefs = (
            <defs>
                <Marker id={MARKERS.MARKER_S} refX={small} fill={config.link.color} {...markerProps} />
                <Marker id={MARKERS.MARKER_SH} refX={small} fill={config.link.highlightColor} {...markerProps} />
                <Marker id={MARKERS.MARKER_M} refX={medium} fill={config.link.color} {...markerProps} />
                <Marker id={MARKERS.MARKER_MH} refX={medium} fill={config.link.highlightColor} {...markerProps} />
                <Marker id={MARKERS.MARKER_L} refX={large} fill={config.link.color} {...markerProps} />
                <Marker id={MARKERS.MARKER_LH} refX={large} fill={config.link.highlightColor} {...markerProps} />
            </defs>
        );

        return cachedDefs;
    };
}

/**
 * Memoized reference for _renderDefs.
 * @param  {Object} config - an object containing rd3g consumer defined configurations {@link #config config} for the graph.
 * @returns {Object} graph reusable objects [defs](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs).
 * @memberof Graph/renderer
 */
const _memoizedRenderDefs = _renderDefs();

/**
 * Method that actually is exported an consumed by Graph component in order to build all Nodes and Link
 * components.
 * @param  {Object.<string, Object>} nodes - an object containing all nodes mapped by their id.
 * @param  {Function[]} nodeCallbacks - array of callbacks for used defined event handler for node interactions.
 * @param  {Array.<Object>} links - array of links {@link #Link|Link}.
 * @param  {Object.<string, Object>} linksMatrix - an object containing a matrix of connections of the graph, for each nodeId,
 * there is an Object that maps adjacent nodes ids (string) and their values (number).
 * ```javascript
 *  // links example
 *  {
 *     "Androsynth": {
 *         "Chenjesu": 1,
 *         "Ilwrath": 1,
 *         "Mycon": 1,
 *         "Spathi": 1,
 *         "Umgah": 1,
 *         "VUX": 1,
 *         "Guardian": 1
 *     },
 *     "Chenjesu": {
 *         "Androsynth": 1,
 *         "Mycon": 1,
 *         "Spathi": 1,
 *         "Umgah": 1,
 *         "VUX": 1,
 *         "Broodhmome": 1
 *     },
 *     ...
 *  }
 * ```
 * @param  {Function[]} linkCallbacks - array of callbacks for used defined event handler for link interactions.
 * @param  {Object} config - an object containing rd3g consumer defined configurations {@link #config config} for the graph.
 * @param  {string} highlightedNode - this value contains a string that represents the some currently highlighted node.
 * @param  {Object} highlightedLink - this object contains a source and target property for a link that is highlighted at some point in time.
 * @param  {string} highlightedLink.source - id of source node for highlighted link.
 * @param  {string} highlightedLink.target - id of target node for highlighted link.
 * @param  {number} transform - value that indicates the amount of zoom transformation.
 * @returns {Object} returns an object containing the generated nodes and links that form the graph.
 * @memberof Graph/renderer
 */
function renderGraphDefs(config) {
    return _memoizedRenderDefs(config);
}

export { renderGraphDefs, renderWithBFS };
