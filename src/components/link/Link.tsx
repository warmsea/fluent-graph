import { isNumber, merge } from "lodash";
import React, { CSSProperties, FC, SVGAttributes, useCallback } from "react";

import { ILinkEnd, ILinkProps } from "./Link.types";

export const CLICK_HELPER_THRESHOLD: number = 12;

export const DEFAULT_LINK_PROPS: Partial<ILinkProps> = {
  lineStyle: {
    stroke: "gray",
    strokeWidth: 1.5
  }
};

export function calcDraw(start: ILinkEnd, end: ILinkEnd): string {
  // TODO remove default offset 8
  const [newStart, newEnd] = calc(start, end, start.offset || 8, end.offset || 8);

  return `M${newStart.x},${newStart.y}L${newEnd.x},${newEnd.y}Z`;

  // TODO move to utils
  type vec2 = { x: number; y: number };
  function calc(
    start: vec2,
    end: vec2,
    offsetStart: number = 0,
    offsetEnd: number = 0
  ): [vec2, vec2] {
    const v = sub(end, start);
    const dir = normalize(v);
    return [
      add(start, times(dir, offsetStart)),
      sub(end, times(dir, offsetEnd))
    ];

    function times(v: vec2, n: number): vec2 {
      return { x: v.x * n, y: v.y * n };
    }

    function sub(v1: vec2, v2: vec2): vec2 {
      return { x: v1.x - v2.x, y: v1.y - v2.y };
    }

    function add(v1: vec2, v2: vec2): vec2 {
      return { x: v1.x + v2.x, y: v1.y + v2.y };
    }

    function normalize(v: vec2): vec2 {
      const len = length(v);
      return { x: v.x / len, y: v.y / len };
    }

    function length(v: vec2): number {
      return Math.sqrt(v.x * v.x + v.y * v.y);
    }
  }
}

export const Link: FC<ILinkProps> = (props: ILinkProps) => {
  props = merge({}, DEFAULT_LINK_PROPS, props);

  const handleOnClickLink = useCallback(
    event => props.onClickLink?.(event, props),
    [props]
  );

  const handleOnMouseOverLink = useCallback(
    event => props.onMouseOverLink?.(event, props),
    [props]
  );

  const handleOnMouseOutLink = useCallback(
    event => props.onMouseOutLink?.(event, props),
    [props]
  );

  const handleOnKeyDownLink = useCallback(
    event => props.onKeyDownLink?.(event, props),
    [props]
  );

  const d: string = calcDraw(props.start, props.end);

  const lineProps: SVGAttributes<SVGPathElement> = {
    d: d,
    className: props.className,
    style: props.lineStyle,

    onClick: handleOnClickLink,
    onMouseOut: handleOnMouseOutLink,
    onMouseOver: handleOnMouseOverLink,
    onKeyDown: handleOnKeyDownLink,

    tabIndex: props.focusable ? 0 : undefined,
    "aria-label": props.getLinkAriaLabel?.(props)
  };

  const strokeWidth: string | number | undefined = props.lineStyle?.strokeWidth;
  const needClickHelper: boolean =
    !!props.onClickLink &&
    (!isNumber(strokeWidth) || strokeWidth < CLICK_HELPER_THRESHOLD);

  const clickHelperLineStyle: CSSProperties = {
    ...props.lineStyle,
    opacity: 0,
    strokeWidth: CLICK_HELPER_THRESHOLD
  };
  const clickHelperLineProps: SVGAttributes<SVGPathElement> = {
    d: d,
    className: props.className,
    style: clickHelperLineStyle,
    onClick: handleOnClickLink
  };

  const lableStyle: CSSProperties = {
    ...props.labelStyle
  };

  const { label, id } = props;
  const textProps: SVGAttributes<SVGTextElement> = {
    dy: -1,
    style: lableStyle
  };

  return (
    <g>
      <path {...lineProps} id={id} />
      {needClickHelper && (
        <path {...clickHelperLineProps} id={`clickHelper-${id}`} />
      )}
      {label && (
        <text {...textProps}>
          <textPath href={`#${id}`}>{label}</textPath>
        </text>
      )}
    </g>
  );
};
