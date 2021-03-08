/**
 * @module Graph/collapse-helper
 * @description
 * Offers a series of methods that allow graph to perform the necessary operations to
 * create the collapsible behavior. These functions will most likely operate on
 * the links matrix.
 */

/**
 * Calculates degree (in and out) of some provided node.
 * @param {string|number} nodeId - the id of the node whom degree we want to compute.
 * @param {Object.<string, Object>} linksMatrix - an object containing a matrix of connections of the graph, for each nodeId,
 * there is an object that maps adjacent nodes ids (string) and their values (number).
 * @returns {Object.<string, number>} returns object containing in and out degree of the node:
 * - inDegree: number
 * - outDegree: number
 * @memberof Graph/collapse-helper
 */
export function computeNodeDegree(nodeId, linksMatrix = {}) {
    return Object.keys(linksMatrix).reduce(
        (acc, source) => {
            if (!linksMatrix[source]) {
                return acc;
            }

            const currentNodeConnections = Object.keys(linksMatrix[source]);

            return currentNodeConnections.reduce((_acc, target) => {
                if (nodeId === source) {
                    _acc.outDegree += linksMatrix[nodeId][target];
                }

                if (nodeId === target) {
                    _acc.inDegree += linksMatrix[source][nodeId];
                }

                return _acc;
            }, acc);
        },
        {
            inDegree: 0,
            outDegree: 0,
        }
    );
}
