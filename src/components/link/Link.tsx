import { isNumber, merge } from "lodash";
import React, { CSSProperties, FC, SVGAttributes, useCallback } from "react";

import { ILinkProps } from "./Link.types";

export const CLICK_HELPER_THRESHOLD: number = 12;

export const DEFAULT_LINK_PROPS: Partial<ILinkProps> = {
  lineStyle: {
    stroke: "gray",
    strokeWidth: 1.5
  }
};

export const Link: FC<ILinkProps> = (props: ILinkProps) => {
  props = merge({}, DEFAULT_LINK_PROPS, props);

  const handleOnClickLink = useCallback(
    event => props.onClickLink?.(event, props.source, props.target),
    [props.onClickLink, props.source, props.target]
  );

  const handleOnMouseOverLink = useCallback(
    event => props.onMouseOverLink?.(event, props.source, props.target),
    [props.onMouseOverLink, props.source, props.target]
  );

  const handleOnMouseOutLink = useCallback(
    event => props.onMouseOutLink?.(event, props.source, props.target),
    [props.onMouseOutLink, props.source, props.target]
  );

  const handleOnKeyDownLink = useCallback(
    event => props.onKeyDownLink?.(event, props.source, props.target),
    [props.onKeyDownLink, props.source, props.target]
  );

  const d: string = `M${props.start.x},${props.start.y}L${props.end.x},${props.end.y}Z`;

  const lineProps: SVGAttributes<SVGPathElement> = {
    d: d,
    className: props.className,
    style: props.lineStyle,

    onClick: handleOnClickLink,
    onMouseOut: handleOnMouseOutLink,
    onMouseOver: handleOnMouseOverLink,
    onKeyDown: handleOnKeyDownLink,

    tabIndex: props.linkFocusable ? 0 : undefined,
    "aria-label": props.getLinkAriaLabel?.(props.source, props.target)
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
