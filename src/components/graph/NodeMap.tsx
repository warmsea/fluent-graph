import { INodeCommonConfig } from "../node/Node.types";
import { IGraphPropsNode } from "./Graph.types";
import { NodeModel } from "./NodeModel";
import { IGraphNodeDatum } from "./LinkMap";

export class NodeMap {
  public rootNode: NodeModel | undefined;

  private _map: Map<string, NodeModel>;

  constructor() {
    this._map = new Map();
  }

  public updateNodeMap(
    nodes: IGraphPropsNode[],
    nodeConfig: INodeCommonConfig
  ): void {
    // Delete nodes that are no longer there
    const toBeDeleted: Set<string> = new Set(this._map.keys());
    nodes.forEach((node: IGraphPropsNode) => {
      toBeDeleted.delete(node.id);
    });
    toBeDeleted.forEach((nodeId: string) => {
      this._map.delete(nodeId);
    });

    // Create new nodes or update existing nodes
    nodes.forEach((node: IGraphPropsNode) => {
      if (this._map.has(node.id)) {
        this._map.get(node.id)?.update(node, nodeConfig);
      } else {
        this._map.set(node.id, new NodeModel(node, nodeConfig));
      }
    });

    // By design use the first node as the root node
    this.rootNode = nodes.length > 0 ? this._map.get(nodes[0].id) : undefined;
  }

  public has(nodeId: string): boolean {
    return this._map.has(nodeId);
  }

  public get(nodeId: string): NodeModel {
    const node: NodeModel | undefined = this._map.get(nodeId);
    if (node) {
      return node;
    } else {
      // TODO handle error
      throw new Error();
    }
  }

  public getSimulationNodeDatums(): IGraphNodeDatum[] {
    const datums: IGraphNodeDatum[] = [];
    this._map.forEach(node => datums.push(node.force));
    return datums;
  }
}
