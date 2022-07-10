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

  public values(): V[] {
    const values: V[] = [];
    this._forEach((value) => values.push(value));
    return values;
  }

  public delete(row: K, column: K): void {
    const matrixRow = this._matrix.get(row);
    matrixRow?.delete(column);
    if (matrixRow?.size === 0) {
      this._matrix.delete(row);
    }
  }

  private _forEach(callback: (value: V, row: K, column: K) => void) {
    this._matrix.forEach((row, key1) => {
      row.forEach((value, key2) => {
        callback(value, key1, key2);
      });
    });
  }
}
