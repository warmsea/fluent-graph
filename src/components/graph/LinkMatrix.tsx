import { ILinkCommonConfig } from '../link/Link.types';
import { IGraphPropsLink } from './Graph.types';
import { LinkModel } from './LinkModel';
import { NodeMap } from './NodeMap';

export class LinkMatrix {
  private _matrix: Map<string, Map<string, LinkModel>>;

  constructor() {
    this._matrix = new Map();
  }

  public updateMatrix(links: IGraphPropsLink[], linkConfig: ILinkCommonConfig, nodeMap: NodeMap): void {
    links.forEach((link: IGraphPropsLink) => {
      const { source, target } = link;
      if (this._matrix.get(source)?.has(target)) {
        // TODO handle existing links
      } else {
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
        this._matrix.get(source)!.set(target, new LinkModel(link, linkConfig, nodeMap));

        if (!this._matrix.get(target)!.has(source)) {
          this._matrix.get(target)!.set(source, this._matrix.get(source)!.get(target)!);
        }
      }
    });
  }

  public forEachWithSource(sourceId: string, callback: (link: LinkModel) => void) {
    this._matrix.get(sourceId)?.forEach(callback);
  }
}
