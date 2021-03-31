import { isNumber, merge } from "lodash";
import React, { CSSProperties, FC, HTMLAttributes } from "react";
import { calcDraw, len, deg, center } from "./LinkHelper";
import { ILinkProps } from "./Link.types";

export const CLICK_HELPER_THRESHOLD: number = 4;

export const DEFAULT_LINK_PROPS: Partial<ILinkProps> = {
  lineStyle: {
    background: "gray",
    height: 1.5 // link size
  }
};

export const Link: FC<ILinkProps> = (props: ILinkProps) => {
  props = merge({}, DEFAULT_LINK_PROPS, props);

  const eventHandlers: HTMLAttributes<HTMLElement> = {
    onClick: event => props.onClickLink?.(event, props),
    onMouseOver: event => props.onMouseOverLink?.(event, props),
    onMouseOut: event => props.onMouseOutLink?.(event, props),
    onKeyDown: event => props.onKeyDownLink?.(event, props)
  };

  const [start, end] = calcDraw(props.start, props.end);

  if (isNaN(start.x) || isNaN(start.y) || isNaN(end.x) || isNaN(end.y)) {
    return <></>;
  }

  const lineCenterPos = center(start, end);
  const linkPosition: CSSProperties = {
    width: len(start, end),
    top: lineCenterPos.y,
    left: lineCenterPos.x,
    transform: `translate(-50%, -50%) rotate(${deg(start, end)}deg)`
  };

  const lineProps: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > = {
    ...eventHandlers,
    style: {
      outlineColor: "black",
      outlineOffset: 2,
      position: "absolute",
      zIndex: 1,
      ...props.lineStyle,
      ...linkPosition
    },
    className: props.className || "fg-link",
    tabIndex: props.focusable ? 0 : undefined,
    "aria-label": props.getLinkAriaLabel?.(props)
  };

  const strokeWidth: string | number | undefined = props.lineStyle?.strokeWidth;
  const needClickHelper: boolean =
    !!props.onClickLink &&
    (!isNumber(strokeWidth) || strokeWidth < CLICK_HELPER_THRESHOLD);

  const clickHelperLineStyle: CSSProperties = {
    ...lineProps.style,
    opacity: 0,
    zIndex: 2,
    height: CLICK_HELPER_THRESHOLD
  };
  const clickHelperLineProps: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > = {
    ...eventHandlers,
    className: props.className || "fg-link",
    style: clickHelperLineStyle
  };

  if (needClickHelper) {
    return (
      <>
        <div {...lineProps}></div>
        <div {...clickHelperLineProps}></div>
      </>
    );
  }

  return <div {...lineProps}></div>;
};
