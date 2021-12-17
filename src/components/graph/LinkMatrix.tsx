import { Matrix } from "../../Matrix";
import { IGraphPropsLink } from "./Graph.types";
import { LinkMap } from "./LinkMap";
import { getLinkId, LinkModel } from "./LinkModel";
import { NodeMap } from "./NodeMap";

export class LinkMatrix {
  private _matrix: Matrix<string, LinkModel>;

  constructor(links: IGraphPropsLink[], linkMap: LinkMap, nodeMap: NodeMap) {
    this._matrix = new Matrix();

    // Rely on the order input by the consumer
    links.forEach((link: IGraphPropsLink) => {
      const { source, target } = link;

      // Ignore links to unknown nodes
      if (!nodeMap.has(source) || !nodeMap.has(target)) {
        return;
      }

      // The later link wins on duplicate
      this._matrix.set(source, target, linkMap.get(getLinkId(link)));

      // Unless explicit specified, links are di-directed.
      if (!this._matrix.get(target, source)) {
        this._matrix.set(target, source, linkMap.get(getLinkId(link)));
      }
    });
  }

  public forEachWithSource(sourceId: string, callback: (link: LinkModel) => void) {
    this._matrix.getRow(sourceId).forEach(callback);
  }
}
