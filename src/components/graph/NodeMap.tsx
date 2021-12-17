import { INodeCommonConfig } from "../node/Node.types";
import { IGraphNodeDatum, IGraphPropsLink, IGraphPropsNode } from "./Graph.types";
import { IZoomState, Ref } from "./Graph.types.internal";
import { NodeModel } from "./NodeModel";
import { getLinkNodeId } from "./LinkModel";
export class NodeMap {
  public rootNode: NodeModel | undefined;

  private _map: Map<string, NodeModel>;
  private _zoomStateRef: Ref<IZoomState>;

  constructor(zoomStateRef: Ref<IZoomState>) {
    this._map = new Map();
    this._zoomStateRef = zoomStateRef;
  }

  public updateNodeMap(
    nodes: IGraphPropsNode[],
    nodeConfig: INodeCommonConfig,
    links: IGraphPropsLink[]
  ): boolean {
    let addedOrRemovedNodes: boolean = false;

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
        addedOrRemovedNodes = true;
        this._map.set(node.id, new NodeModel(node, nodeConfig, this._zoomStateRef));
      }
    });

    links.forEach((link) => {
      if (this._map.has(getLinkNodeId(link))) {
        this._map.get(getLinkNodeId(link))?.update(
          {
            id: getLinkNodeId(link),
          },
          {},
          [link.target, link.source],
          true
        );
      } else {
        this._map.set(
          getLinkNodeId(link),
          new NodeModel(
            {
              id: getLinkNodeId(link),
            },
            {},
            undefined,
            [link.target, link.source],
            true
          )
        );
      }
    });

    // By design use the first node as the root node
    this.rootNode = nodes.length > 0 ? this._map.get(nodes[0].id) : undefined;

    return addedOrRemovedNodes;
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
    this._map.forEach((node) => datums.push(node.force));
    return datums;
  }
}
