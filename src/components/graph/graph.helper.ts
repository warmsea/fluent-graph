/**
 * @module Graph/helper
 * @description
 * Offers a series of methods that isolate logic of Graph component and also from Graph rendering methods.
 */
/**
 * @typedef {Object} Link
 * @property {string} source - the node id of the source in the link.
 * @property {string} target - the node id of the target in the link.
 * @memberof Graph/helper
 */
/**
 * @typedef {Object} Node
 * @property {string} id - the id of the node.
 * @property {string} [color=] - color of the node (optional).
 * @property {string} [fontColor=] - node text label font color (optional).
 * @property {string} [size=] - size of the node (optional).
 * @property {string} [symbolType=] - symbol type of the node (optional).
 * @property {string} [svg=] - custom svg for node (optional).
 * @memberof Graph/helper
 */
import {
  forceX as d3ForceX,
  forceY as d3ForceY,
  forceSimulation as d3ForceSimulation,
  forceManyBody as d3ForceManyBody
} from "d3-force";
import { pick, isEqual, isEmpty, clamp, merge } from "lodash";

import CONST from "./graph.const";
import { DEFAULT_CONFIG } from "./graph.config";
import ERRORS from "../../err";

import { antiPick, throwErr } from "../../utils";
import {
  IGraphPropsData,
  IGraphProps,
  IGraphState,
  IGraphLinkMap,
  IGraphPropsDataLink
} from "./Graph.types";

const NODE_PROPS_WHITELIST = ["id", "x", "y", "index", "vy", "vx"];
const LINK_PROPS_WHITELIST = ["index", "source", "target"];

/**
 * Create d3 forceSimulation to be applied on the graph.<br/>
 * {@link https://github.com/d3/d3-force#forceSimulation|d3-force#forceSimulation}<br/>
 * {@link https://github.com/d3/d3-force#simulation_force|d3-force#simulation_force}<br/>
 * Wtf is a force? {@link https://github.com/d3/d3-force#forces| here}
 * @param  {number} width - the width of the container area of the graph.
 * @param  {number} height - the height of the container area of the graph.
 * @param  {number} gravity - the force strength applied to the graph.
 * @returns {Object} returns the simulation instance to be consumed.
 * @memberof Graph/helper
 */
function _createForceSimulation(width, height, gravity) {
  const frx = d3ForceX(width / 2).strength(CONST.FORCE_X);
  const fry = d3ForceY(height / 2).strength(CONST.FORCE_Y);
  const forceStrength = gravity;

  return d3ForceSimulation()
    .force("charge", d3ForceManyBody().strength(forceStrength))
    .force("x", frx)
    .force("y", fry);
}

/**
 * Receives a matrix of the graph with the links source and target as concrete node instances and it transforms it
 * in a lightweight matrix containing only links with source and target being strings representative of some node id
 * and the respective link value (if non existent will default to 1).
 * @param  {Array.<Link>} graphLinks - an array of all graph links.
 * @param  {Object} config - the graph config.
 * @returns {Object.<string, Object>} an object containing a matrix of connections of the graph, for each nodeId,
 * there is an object that maps adjacent nodes ids (string) and their values (number).
 * @memberof Graph/helper
 */
function _initializeLinks(graphLinks: IGraphPropsDataLink[]): IGraphLinkMap {
  return graphLinks.reduce((links: IGraphLinkMap, l) => {
    const source = getId(l.source);
    const target = getId(l.target);

    if (!links[source]) {
      links[source] = {};
    }

    if (!links[target]) {
      links[target] = {};
    }

    links[source][target] = links[target][source] = l.value || 1;

    return links;
  }, {});
}

/**
 * Method that initialize graph nodes provided by rd3g consumer and adds additional default mandatory properties
 * that are optional for the user. Also it generates an index mapping, this maps nodes ids the their index in the array
 * of nodes. This is needed because d3 callbacks such as node click and link click return the index of the node.
 * @param  {Array.<Node>} graphNodes - the array of nodes provided by the rd3g consumer.
 * @returns {Object.<string, Object>} returns the nodes ready to be used within rd3g with additional properties such as x, y.
 * @memberof Graph/helper
 */
function _initializeNodes(graphNodes) {
  let nodes = {};
  const n = graphNodes.length;

  for (let i = 0; i < n; i++) {
    const node = graphNodes[i];

    // if an fx (forced x) is given, we want to use that
    node.x = node.fx ?? node.x ?? 0;

    // if an fy (forced y) is given, we want to use that
    node.y = node.fy ?? node.y ?? 0;

    nodes[node.id.toString()] = node;
  }

  return nodes;
}

/**
 * Maps an input link (with format `{ source: 'sourceId', target: 'targetId' }`) to a d3Link
 * (with format `{ source: { id: 'sourceId' }, target: { id: 'targetId' } }`). If d3Link with
 * given index exists already that same d3Link is returned.
 * @param {Object} link - input link.
 * @param {number} index - index of the input link.
 * @param {Array.<Object>} d3Links - all d3Links.
 * @param  {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @param {Object} state - Graph component current state (same format as returned object on this function).
 * @returns {Object} a d3Link.
 * @memberof Graph/helper
 */
function _mergeDataLinkWithD3Link(link, index, d3Links = []) {
  // find the matching link if it exists
  const tmp = d3Links.find(
    (l: any) => l.source.id === link.source && l.target.id === link.target
  );
  const d3Link: any = tmp && pick(tmp, LINK_PROPS_WHITELIST);
  const customProps = antiPick(link, ["source", "target"]);

  if (d3Link) {
    const refinedD3Link = {
      index,
      ...d3Link,
      ...customProps
    };

    return { ...refinedD3Link };
  }

  const source = {
    id: link.source
  };
  const target = {
    id: link.target
  };

  return {
    index,
    source,
    target,
    ...customProps
  };
}

/**
 * Some integrity validations on links and nodes structure. If some validation fails the function will
 * throw an error.
 * @param  {Object} data - Same as {@link #initializeGraphState|data in initializeGraphState}.
 * @throws can throw the following error or warning msg:
 * INSUFFICIENT_DATA - msg if no nodes are provided
 * INVALID_LINKS - if links point to nonexistent nodes
 * INSUFFICIENT_LINKS - if no links are provided (not even empty Array)
 * @returns {undefined}
 * @memberof Graph/helper
 */
function _validateGraphData(nodes, links): void {
  links.forEach(l => {
    if (!nodes.find(n => n.id === l.source)) {
      throwErr(
        "Graph",
        `${ERRORS.INVALID_LINKS} - "${l.source}" is not a valid source node id`
      );
    }
    if (!nodes.find(n => n.id === l.target)) {
      throwErr(
        "Graph",
        `${ERRORS.INVALID_LINKS} - "${l.target}" is not a valid target node id`
      );
    }
  });
}

// list of properties that are of no interest when it comes to nodes and links comparison
const NODE_PROPERTIES_DISCARD_TO_COMPARE = ["x", "y", "vx", "vy", "index"];

/**
 * Picks the id.
 * @param {Object} o object to pick from.
 * @returns {Object} new object with id property only.
 * @memberof Graph/helper
 */
function _pickId(o) {
  return pick(o, ["id"]);
}

/**
 * Picks source and target.
 * @param {Object} o object to pick from.
 * @returns {Object} new object with source and target only.
 * @memberof Graph/helper
 */
function _pickSourceAndTarget(o) {
  return pick(o, ["source", "target"]);
}

/**
 * This function checks for graph elements (nodes and links) changes, in two different
 * levels of significance, updated elements (whether some property has changed in some
 * node or link) and new elements (whether some new elements or added/removed from the graph).
 * @param {Object} nextProps - nextProps that graph will receive.
 * @param {Object} currentState - the current state of the graph.
 * @returns {Object.<string, boolean>} returns object containing update check flags:
 * - newGraphElements - flag that indicates whether new graph elements were added.
 * - graphElementsUpdated - flag that indicates whether some graph elements have
 * updated (some property that is not in NODE_PROPERTIES_DISCARD_TO_COMPARE was added to
 * some node or link or was updated).
 * @memberof Graph/helper
 */
function checkForGraphElementsChanges(nextProps, currentState) {
  const nextNodes = nextProps.data.nodes.map(n =>
    antiPick(n, NODE_PROPERTIES_DISCARD_TO_COMPARE)
  );
  const nextLinks = nextProps.data.links;
  const stateD3Nodes = currentState.d3Nodes.map(n =>
    antiPick(n, NODE_PROPERTIES_DISCARD_TO_COMPARE)
  );
  const stateD3Links = currentState.d3Links.map(l => ({
    source: getId(l.source),
    target: getId(l.target)
  }));
  const graphElementsUpdated = !(
    isEqual(nextNodes, stateD3Nodes) && isEqual(nextLinks, stateD3Links)
  );
  const newGraphElements =
    nextNodes.length !== stateD3Nodes.length ||
    nextLinks.length !== stateD3Links.length ||
    !isEqual(nextNodes.map(_pickId), stateD3Nodes.map(_pickId)) ||
    !isEqual(
      nextLinks.map(_pickSourceAndTarget),
      stateD3Links.map(_pickSourceAndTarget)
    );

  return { graphElementsUpdated, newGraphElements };
}

/**
 * Logic to check for changes in graph config.
 * @param {Object} nextProps - nextProps that graph will receive.
 * @param {Object} currentState - the current state of the graph.
 * @returns {Object.<string, boolean>} returns object containing update check flags:
 * - configUpdated - global flag that indicates if any property was updated.
 * - d3ConfigUpdated - specific flag that indicates changes in d3 configurations.
 * @memberof Graph/helper
 */
function checkForGraphConfigChanges(nextProps, currentState) {
  const newConfig = nextProps.config || {};
  const configUpdated =
    newConfig &&
    !isEmpty(newConfig) &&
    !isEqual(newConfig, currentState.config);
  const d3ConfigUpdated =
    newConfig && newConfig.d3 && !isEqual(newConfig.d3, currentState.config.d3);

  return { configUpdated, d3ConfigUpdated };
}

/**
 * Returns the transformation to apply in order to center the graph on the
 * selected node.
 * @param {Object} d3Node - node to focus the graph view on.
 * @param {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @returns {string|undefined} transform rule to apply.
 * @memberof Graph/helper
 */
function getCenterAndZoomTransformation(d3Node, config) {
  if (!d3Node) {
    return;
  }

  const { width, height, focusZoom } = config;

  return `
        translate(${width / 2}, ${height / 2})
        scale(${focusZoom})
        translate(${-d3Node.x}, ${-d3Node.y})
    `;
}

/**
 * This function extracts an id from a link.
 * **Why this function?**
 * According to [d3-force](https://github.com/d3/d3-force#link_links)
 * d3 links might be initialized with "source" and "target"
 * properties as numbers or strings, but after initialization they
 * are converted to an object. This small utility functions ensures
 * that weather in initialization or further into the lifetime of the graph
 * we always get the id.
 * @param {Object|string|number} sot source or target
 * of the link to extract id.
 * we want to extract an id.
 * @returns {string|number} the id of the link.
 * @memberof Graph/helper
 */
function getId(sot) {
  return sot.id !== undefined && sot.id !== null ? sot.id : sot;
}

/**
 * Encapsulates common procedures to initialize graph.
 * @param {Object} props - Graph component props, object that holds data, id and config.
 * @param {Object} props.data - Data object holds links (array of **Link**) and nodes (array of **Node**).
 * @param {string} props.id - the graph id.
 * @param {Object} props.config - same as {@link #graphrenderer|config in renderGraph}.
 * @param {Object} state - Graph component current state (same format as returned object on this function).
 * @returns {Object} a fully (re)initialized graph state object.
 * @memberof Graph/helper
 */
function initializeGraphState(
  props: IGraphProps,
  state: IGraphState
): IGraphState {
  const graphConfig = merge({}, DEFAULT_CONFIG, props.config);
  _validateGraphData(props.nodes, props.links);

  let graph: IGraphPropsData;

  if (state?.nodes) {
    graph = {
      nodes: props.nodes.map(n =>
        state.nodes[n.id]
          ? { ...n, ...pick(state.nodes[n.id], NODE_PROPS_WHITELIST) }
          : { ...n }
      ),
      links: props.links.map((l, index) =>
        _mergeDataLinkWithD3Link(l, index, state && state.d3Links)
      )
    };
  } else {
    graph = {
      nodes: props.nodes.map(n => ({ ...n })),
      links: props.links.map(l => ({ ...l }))
    };
  }

  const links = _initializeLinks(graph.links); // matrix of graph connections
  const nodes = _initializeNodes(graph.nodes);
  const { nodes: d3Nodes, links: d3Links } = graph;
  const simulation = _createForceSimulation(
    graphConfig.width,
    graphConfig.height,
    graphConfig.d3.gravity
  );
  graphConfig.focusZoom = clamp(
    graphConfig.focusZoom,
    graphConfig.minZoom,
    graphConfig.maxZoom
  );

  return {
    config: graphConfig,
    links,
    d3Links,
    nodes,
    d3Nodes,
    simulation,
    newGraphElements: false,
    configUpdated: false,
    transform: 1,
    draggedNode: null
  };
}

/**
 * Computes the normalized vector from a vector.
 * @param {Object} vector a 2D vector with x and y components
 * @param {number} vector.x x coordinate
 * @param {number} vector.y y coordinate
 * @returns {Object} normalized vector
 * @memberof Graph/helper
 */
function normalize(vector) {
  const norm = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
  return { x: vector.x / norm, y: vector.y / norm };
}

/**
 * Computes new node coordinates to make arrowheads point at nodes.
 * Arrow configuration is only available for circles.
 * @param {Object} node - the couple of nodes we need to compute new coordinates
 * @param {Object} node.source - node source
 * @param {Object} node.target - node target
 * @param {Object.<string, Object>} nodes - same as {@link #graphrenderer|nodes in renderGraph}.
 * @param {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @param {number} strokeWidth width of the link stroke
 * @returns {Object} new nodes coordinates
 * @memberof Graph/helper
 */
function getNormalizedNodeCoordinates(
  { source = {} as any, target = {} as any },
  nodes,
  config
) {
  let { x: x1, y: y1, id: sourceId } = source;
  let { x: x2, y: y2, id: targetId } = target;

  switch (config.node?.symbolType) {
    case CONST.SYMBOLS.CIRCLE: {
      const directionVector = normalize({ x: x2 - x1, y: y2 - y1 });

      const sourceNodeSize = nodes?.[sourceId]?.size || config.node.size;
      const targetNodeSize = nodes?.[targetId]?.size || config.node.size;

      const sourceNodeRadius = nodes?.[sourceId]?.radius;
      const targetNodeRadius = nodes?.[targetId]?.radius;

      // cause this is a circle and A = pi * r^2
      const sourceRadius =
        sourceNodeRadius || Math.sqrt(sourceNodeSize / Math.PI);
      const targetRadius =
        targetNodeRadius || Math.sqrt(targetNodeSize / Math.PI);

      // points from the source, we move them not to begin in the circle but outside
      x1 += sourceRadius * directionVector.x;
      y1 += sourceRadius * directionVector.y;
      // points from the target, we move the by the size of the radius of the circle + the size of the arrow
      x2 -= targetRadius * directionVector.x;
      y2 -= targetRadius * directionVector.y;
      break;
    }
  }

  return { source: { x: x1, y: y1 }, target: { x: x2, y: y2 } };
}

export {
  checkForGraphConfigChanges,
  checkForGraphElementsChanges,
  getCenterAndZoomTransformation,
  getId,
  initializeGraphState,
  getNormalizedNodeCoordinates
};
