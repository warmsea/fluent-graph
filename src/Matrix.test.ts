import { Matrix } from "./Matrix";

describe("Matrix", () => {
  let matrix: Matrix<string, string>;

  beforeEach(() => {
    matrix = new Matrix<string, string>();
    matrix.set("a", "b", "hello");
    matrix.set("a", "c", "world");
    matrix.set("b", "c", "yes");
  });

  describe("get()", () => {
    it("should return undefined if the value does not exist", () => {
      expect(matrix.get("not_exist", "not_exist")).toBeUndefined();
    });

    it("should return the correct value", () => {
      expect(matrix.get("a", "b")).toBe("hello");
    });
  });

  describe("getRow()", () => {
    it("should return an empty array if the row does not exist", () => {
      expect(matrix.getRow("not_exist")).toEqual([]);
    });

    it("should return an empty array if the row does not exist", () => {
      expect(matrix.getRow("a")).toEqual(["hello", "world"]);
    });
  });

  describe("values()", () => {
    it("should return all values in the matrix", () => {
      expect(matrix.values()).toEqual(["hello", "world", "yes"]);
    });
  });

  describe("delete()", () => {
    it("should delete a record", () => {
      matrix.delete("b", "c");
      expect(matrix.values()).toEqual(["hello", "world"]);
    });
  });
});
