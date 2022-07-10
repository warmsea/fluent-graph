import { Matrix } from "../../Matrix";
import { IGraphPropsLink } from "./Graph.types";

export class LinkIdStore {
  private _matrix: Matrix<string, string> = new Matrix();
  private _map: Map<string, [string, string]> = new Map();

  public getId(link: IGraphPropsLink): string {
    const existing = this._matrix.get(link.source, link.target);
    if (existing) {
      return existing;
    } else {
      const newId = this._createId();
      this._matrix.set(link.source, link.target, newId);
      this._map.set(newId, [link.source, link.target]);
      return newId;
    }
  }

  public getKeyPair(linkId: string): [string, string] {
    const keyPair = this._map.get(linkId);
    if (!keyPair) {
      throw new Error(`This is likely a Fluent Graph bug, linkId not exist: ${linkId}`);
    }
    return keyPair;
  }

  private _createId(): string {
    return `fg-l-${Math.random()}`;
  }
}
