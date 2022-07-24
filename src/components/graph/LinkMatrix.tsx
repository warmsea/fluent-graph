import { Matrix } from "../../Matrix";
import { ILinkCommonConfig } from "../link/Link.types";
import { IGraphLinkDatum, IGraphNodeDatum, IGraphPropsLink } from "./Graph.types";
import { LinkIdStore } from "./LinkIdStore";
import { LinkModel } from "./LinkModel";
import { NodeMap } from "./NodeMap";

export class LinkMatrix {
  private _linkIdStore: LinkIdStore;
  private _matrix: Matrix<string, LinkModel>;
  private _collideNodes: Map<string, IGraphNodeDatum>;

  constructor() {
    this._linkIdStore = new LinkIdStore();
    this._matrix = new Matrix();
    this._collideNodes = new Map();
  }

  public update(links: IGraphPropsLink[], linkConfig: ILinkCommonConfig, nodeMap: NodeMap): boolean {
    let addedOrRemovedLinks = false;

    // Delete links that are no longer there
    const toBeDeleted: Set<string> = new Set(this._matrix.values().map((value) => value.id));
    links.forEach((link) => {
      toBeDeleted.delete(this._getLinkId(link));
    });
    toBeDeleted.forEach((linkId) => {
      addedOrRemovedLinks = true;
      this._matrix.delete(...this._linkIdStore.getKeyPair(linkId));
      this._collideNodes.delete(linkId);
    });

    // Create new links or update existing links
    links.forEach((link) => {
      const existingLink = this._matrix.get(link.source, link.target);
      const linkId = this._getLinkId(link);
      if (existingLink) {
        existingLink.update(linkId, link);
      } else {
        this._matrix.set(link.source, link.target, new LinkModel(linkId, link, linkConfig, nodeMap));
        this._collideNodes.set(linkId, { id: linkId, size: 0 });
      }
    });

    return addedOrRemovedLinks;
  }

  public updateCollideNotesPosition(): void {
    this._collideNodes.forEach((collideNode, linkId) => {
      const link = this._matrix.get(...this._linkIdStore.getKeyPair(linkId));
      if (link) {
        const sourceForce = link.sourceNode.force;
        const targetForce = link.targetNode.force;
        collideNode.fx = this._getMiddle(sourceForce.x, targetForce.x);
        collideNode.fy = this._getMiddle(sourceForce.y, targetForce.y);
      }
    });
  }

  public forEachWithSource(sourceId: string, callback: (link: LinkModel) => void): void {
    this._matrix.getRow(sourceId).forEach(callback);
  }

  public getSimLinks(): IGraphLinkDatum[] {
    return this._matrix.values().map((link) => link.force);
  }

  public getSimCollideNodes(): IGraphNodeDatum[] {
    return Array.from(this._collideNodes.values());
  }

  private _getLinkId(link: IGraphPropsLink) {
    return this._linkIdStore.getId(link);
  }

  private _getMiddle(start: number | undefined, end: number | undefined): number | undefined {
    if (start !== undefined && end !== undefined) {
      return (start + end) / 2;
    } else {
      return undefined;
    }
  }
}
