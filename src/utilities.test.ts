import { mergeConfig } from "./utilities";

describe("mergeConfig", () => {
  it("should deep merge config", () => {
    const defaults = { onlyA: "A", both: "A", deep: { onlyA: "A", both: "A" } };
    const explicits = {
      onlyB: "B",
      both: "B",
      deep: { onlyB: "B", both: "B" },
    };
    expect(mergeConfig(defaults, explicits)).toEqual({
      onlyA: "A",
      onlyB: "B",
      both: "B",
      deep: {
        onlyA: "A",
        onlyB: "B",
        both: "B",
      },
    });
    expect(defaults).toEqual({
      onlyA: "A",
      both: "A",
      deep: { onlyA: "A", both: "A" },
    });
    expect(explicits).toEqual({
      onlyB: "B",
      both: "B",
      deep: { onlyB: "B", both: "B" },
    });
  });
});
