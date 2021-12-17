import { IGraphLinkDatum, IGraphPropsLink } from "./Graph.types";
import { getLinkId, LinkModel } from "./LinkModel";
import { ILinkCommonConfig } from "../link/Link.types";
import { NodeMap } from "./NodeMap";

export class LinkMap {
  private _map: Map<string, LinkModel>;

  constructor() {
    this._map = new Map();
  }

  public updateLinkMap(links: IGraphPropsLink[], linkConfig: ILinkCommonConfig, nodeMap: NodeMap): boolean {
    let addedOrRemovedLinks = false;

    // Delete links that are no longer there
    const toBeDeleted: Set<string> = new Set(this._map.keys());
    links.forEach((link: IGraphPropsLink) => {
      toBeDeleted.delete(getLinkId(link));
    });
    toBeDeleted.forEach((linkId: string) => {
      addedOrRemovedLinks = true;
      this._map.delete(linkId);
    });

    // Create new links or update existing links
    links.forEach((link: IGraphPropsLink) => {
      const linkId = getLinkId(link);
      if (this._map.has(linkId)) {
        this._map.get(linkId)?.update(link, linkConfig);
      } else {
        addedOrRemovedLinks = true;
        this._map.set(linkId, new LinkModel(link, linkConfig, nodeMap));
      }
    });

    return addedOrRemovedLinks;
  }

  public has(linkId: string): boolean {
    return this._map.has(linkId);
  }

  public get(linkId: string): LinkModel {
    const link: LinkModel | undefined = this._map.get(linkId);
    if (link) {
      return link;
    } else {
      // TODO handle error
      throw new Error();
    }
  }

  public getSimulationLinkDatums(): IGraphLinkDatum[] {
    const datums: IGraphLinkDatum[] = [];
    this._map.forEach((link) => datums.push(link.force));
    return datums;
  }
}
