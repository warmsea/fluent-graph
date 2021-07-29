import { css, mergeConfig } from "../src/utils";

describe("css", () => {
  it("should join css class names with spaces", () => {
    expect(css()).toEqual("");
    expect(css("a")).toEqual("a");
    expect(css("a", "b")).toEqual("a b");
    expect(css("a", "b", "c")).toEqual("a b c");
  });
});

describe("mergeConfig", () => {
  it("should deep merge config", () => {
    const defaults = { onlyA: "A", both: "A", deep: { onlyA: "A", both: "A" } };
    const explicits = {
      onlyB: "B",
      both: "B",
      deep: { onlyB: "B", both: "B" }
    };
    expect(mergeConfig(defaults, explicits)).toEqual({
      onlyA: "A",
      onlyB: "B",
      both: "B",
      deep: {
        onlyA: "A",
        onlyB: "B",
        both: "B"
      }
    });
    expect(defaults).toEqual({
      onlyA: "A",
      both: "A",
      deep: { onlyA: "A", both: "A" }
    });
    expect(explicits).toEqual({
      onlyB: "B",
      both: "B",
      deep: { onlyB: "B", both: "B" }
    });
  });
});
