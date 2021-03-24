import { SimulationNodeDatum, SimulationLinkDatum } from "d3";
import { IGraphPropsLink } from "./Graph.types";
import { LinkModel } from "./LinkModel";
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
    nodeMap: NodeMap,
    linkConfig?: ILinkCommonConfig
  ): void {
    links.forEach((link: IGraphPropsLink) => {
      if (this._map.has(`${link.source},${link.target}`)) {
        // TODO handle existing nodes
      } else {
        this._map.set(
          `${link.source},${link.target}`,
          new LinkModel(link, nodeMap, linkConfig)
        );
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
