import { ILinkEnd } from "./Link.types";

export function calcDraw(start: ILinkEnd, end: ILinkEnd): [ILinkEnd, ILinkEnd] {
  const v = sub(end, start);
  const dir = normalize(v);
  return [add(start, times(dir, start.offset || 0)), sub(end, times(dir, end.offset || 0))];
}

export function deg(src: ILinkEnd, tar: ILinkEnd) {
  return (Math.atan2(tar.y - src.y, tar.x - src.x) * 180) / Math.PI;
}

export function center(src: ILinkEnd, tar: ILinkEnd) {
  return { x: (tar.x + src.x) / 2, y: (tar.y + src.y) / 2 };
}

export function len(src: ILinkEnd, tar: ILinkEnd) {
  return Math.sqrt((tar.y - src.y) * (tar.y - src.y) + (tar.x - src.x) * (tar.x - src.x)) || 0;
}
function length(v: ILinkEnd): number {
  return Math.sqrt(v.x * v.x + v.y * v.y) || 0;
}

function times(v: ILinkEnd, n: number): ILinkEnd {
  return { x: v.x * n, y: v.y * n };
}

function sub(v1: ILinkEnd, v2: ILinkEnd): ILinkEnd {
  return { x: v1.x - v2.x, y: v1.y - v2.y };
}

function add(v1: ILinkEnd, v2: ILinkEnd): ILinkEnd {
  return { x: v1.x + v2.x, y: v1.y + v2.y };
}

function normalize(v: ILinkEnd): ILinkEnd {
  const len = length(v);
  return { x: v.x / len, y: v.y / len };
}
