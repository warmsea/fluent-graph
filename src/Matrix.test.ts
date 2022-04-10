import { Matrix } from "./Matrix";

describe("Matrix", () => {
  describe("get", () => {
    it("should return undefined if the value does not exist", () => {
      const matrix = new Matrix<string, string>();
      expect(matrix.get("a", "b")).toBeUndefined();
    });

    it("should return the correct value", () => {
      const matrix = new Matrix<string, string>();
      matrix.set("a", "b", "hello");
      matrix.set("a", "c", "world");
      expect(matrix.get("a", "b")).toBe("hello");
      expect(matrix.get("a", "c")).toBe("world");
    });
  });

  describe("getRow", () => {
    it("should return an empty array if the row does not exist", () => {
      const matrix = new Matrix<string, string>();
      expect(matrix.getRow("a")).toEqual([]);
    });

    it("should return an empty array if the row does not exist", () => {
      const matrix = new Matrix<string, string>();
      matrix.set("a", "b", "hello");
      matrix.set("a", "c", "world");
      expect(matrix.getRow("a")).toEqual(["hello", "world"]);
    });
  });
});
