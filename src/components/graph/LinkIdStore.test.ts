import { LinkIdStore } from "./LinkIdStore";

describe("LinkIdStore", () => {
  it("should generate link ids", () => {
    const store = new LinkIdStore();
    expect(store.getId({ source: "a", target: "b" })).toBeTruthy();
  });

  it("should return the same id for the same link", () => {
    const store = new LinkIdStore();
    const first = store.getId({ source: "a", target: "b" });
    const second = store.getId({ source: "a", target: "b" });
    expect(second).toEqual(first);
  });

  it("should allow check key pairs by link id", () => {
    const store = new LinkIdStore();
    const linkId = store.getId({ source: "a", target: "b" });
    expect(store.getKeyPair(linkId)).toEqual(["a", "b"]);
  });

  it("should throw if key pair does not exist", () => {
    const store = new LinkIdStore();
    expect(() => store.getKeyPair("not_exist")).toThrow();
  });
});
