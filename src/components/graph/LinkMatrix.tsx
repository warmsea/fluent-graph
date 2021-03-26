import { IGraphPropsLink } from "./Graph.types";
import { LinkMap } from "./LinkMap";
import { getLinkId, LinkModel } from "./LinkModel";
import { NodeMap } from "./NodeMap";

export class LinkMatrix {
  private _matrix: Map<string, Map<string, LinkModel>>;

  constructor(links: IGraphPropsLink[], linkMap: LinkMap, nodeMap: NodeMap) {
    this._matrix = new Map();

    // Rely on the order input by the consumer
    links.forEach((link: IGraphPropsLink) => {
      const { source, target } = link;

      // Ignore links to unknown nodes
      if (!nodeMap.has(source) || !nodeMap.has(target)) {
        return;
      }

      if (!this._matrix.has(source)) {
        this._matrix.set(source, new Map());
      }
      if (!this._matrix.has(target)) {
        this._matrix.set(target, new Map());
      }

      // The later one wins on duplicate
      this._matrix.get(source)!.set(target, linkMap.get(getLinkId(link)));

      if (!this._matrix.get(target)!.has(source)) {
        this._matrix.get(target)!.set(source, linkMap.get(getLinkId(link)));
      }
    });
  }

  public forEachWithSource(
    sourceId: string,
    callback: (link: LinkModel) => void
  ) {
    this._matrix.get(sourceId)?.forEach(callback);
  }
}
