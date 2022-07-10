import { INodeCommonConfig } from "../node/Node.types";
import { IGraphNodeDatum, IGraphPropsNode } from "./Graph.types";
import { NodeModel } from "./NodeModel";

export class NodeMap {
  public rootNode: NodeModel | undefined;

  private _map: Map<string, NodeModel>;

  constructor() {
    this._map = new Map();
  }

  public update(nodes: IGraphPropsNode[], nodeConfig: INodeCommonConfig): boolean {
    let addedOrRemovedNodes = false;

    // Delete nodes that are no longer there
    const toBeDeleted: Set<string> = new Set(this._map.keys());
    nodes.forEach((node: IGraphPropsNode) => {
      toBeDeleted.delete(node.id);
    });
    toBeDeleted.forEach((nodeId: string) => {
      addedOrRemovedNodes = true;
      this._map.delete(nodeId);
    });

    // Create new nodes or update existing nodes
    nodes.forEach((node: IGraphPropsNode) => {
      if (this._map.has(node.id)) {
        this._map.get(node.id)?.update(node, nodeConfig);
      } else {
        this._map.set(node.id, new NodeModel(node, nodeConfig));
        addedOrRemovedNodes = true;
      }
    });

    // By design use the first node as the root node
    this.rootNode = nodes.length > 0 ? this._map.get(nodes[0].id) : undefined;

    return addedOrRemovedNodes;
  }

  public has(nodeId: string): boolean {
    return this._map.has(nodeId);
  }

  public get(nodeId: string): NodeModel | undefined {
    return this._map.get(nodeId);
  }

  public getSimNodes(): IGraphNodeDatum[] {
    const datums: IGraphNodeDatum[] = [];
    this._map.forEach((node) => datums.push(node.force));
    return datums;
  }
}
