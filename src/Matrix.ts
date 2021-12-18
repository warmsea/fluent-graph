export class Matrix<K, V> {
  private _matrix: Map<K, Map<K, V>>;

  constructor() {
    this._matrix = new Map();
  }

  public set(row: K, column: K, value: V): void {
    if (!this._matrix.has(row)) {
      this._matrix.set(row, new Map());
    }
    this._matrix.get(row)?.set(column, value);
  }

  public get(row: K, column: K): V | undefined {
    return this._matrix.get(row)?.get(column);
  }

  public getRow(row: K): V[] {
    return Array.from(this._matrix.get(row)?.values() ?? []);
  }
}
