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
  // TODO respect offset
  return `M${start.x},${start.y}L${end.x},${end.y}Z`;
}

export const Link: FC<ILinkProps> = (props: ILinkProps) => {
  props = merge({}, DEFAULT_LINK_PROPS, props);

  const handleOnClickLink = useCallback(
    event => props.onClickLink?.(event, props),
    [props.onClickLink, props]
  );

  const handleOnMouseOverLink = useCallback(
    event => props.onMouseOverLink?.(event, props),
    [props.onMouseOverLink, props]
  );

  const handleOnMouseOutLink = useCallback(
    event => props.onMouseOutLink?.(event, props),
    [props.onMouseOutLink, props]
  );

  const handleOnKeyDownLink = useCallback(
    event => props.onKeyDownLink?.(event, props),
    [props.onKeyDownLink, props]
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
