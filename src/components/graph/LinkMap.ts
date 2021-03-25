import { SimulationNodeDatum, SimulationLinkDatum } from "d3";
import { IGraphPropsLink } from "./Graph.types";
import { getLinkId, LinkModel } from "./LinkModel";
import { ILinkCommonConfig } from "../link/Link.types";
import { NodeMap } from "./NodeMap";

export interface IGraphNodeDatum extends SimulationNodeDatum {
  id: string;
}

export class LinkMap {
  private _map: Map<string, LinkModel>;

  constructor() {
    this._map = new Map();
  }

  public updateLinkMap(
    links: IGraphPropsLink[],
    linkConfig: ILinkCommonConfig,
    nodeMap: NodeMap
  ): void {
    // Delete links that are no longer there
    const toBeDeleted: Set<string> = new Set(this._map.keys());
    links.forEach((link: IGraphPropsLink) => {
      toBeDeleted.delete(getLinkId(link));
    });
    toBeDeleted.forEach((linkId: string) => {
      this._map.delete(linkId);
    });

    // Create new links or update existing links
    links.forEach((link: IGraphPropsLink) => {
      const linkId = getLinkId(link);
      if (this._map.has(linkId)) {
        this._map.get(linkId)?.update(link, linkConfig);
      } else {
        this._map.set(linkId, new LinkModel(link, linkConfig, nodeMap));
      }
    });
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

  public getSimulationLinkDatums(): SimulationLinkDatum<SimulationNodeDatum>[] {
    const datums: SimulationLinkDatum<SimulationNodeDatum>[] = [];
    this._map.forEach(link => datums.push(link.force));
    return datums;
  }
}
