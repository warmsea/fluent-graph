import React, { CSSProperties, FC, HTMLAttributes } from "react";
import { mergeConfig } from "../../utils";
import { calcDraw, len, deg, center } from "./Link.helper";
import { ILinkCommonConfig, ILinkProps } from "./Link.types";

export const LINK_CLASS_ROOT: string = "fg-link-root";
export const LINK_CLASS_LINE: string = "fg-link-line";
export const DEFAULT_LINK_PROPS: ILinkCommonConfig = {
  size: 2,
  color: "gray",
  lineType: "solid",
  style: {
    position: "absolute",
    zIndex: 1
  },
  lineStyle: {
    position: "absolute",
    background: "transparent"
  }
};
export const CLICK_HELPER_THRESHOLD: number = 4;

export const Link: FC<ILinkProps> = (props: ILinkProps) => {
  props = mergeConfig(DEFAULT_LINK_PROPS, props);
  const [start, end] = calcDraw(props.start, props.end);
  if (isNaN(start.x) || isNaN(start.y) || isNaN(end.x) || isNaN(end.y)) {
    return <></>;
  }

  const eventHandlers: HTMLAttributes<HTMLElement> = {
    onClick: event => props.onClickLink?.(event, props),
    onMouseOver: event => props.onMouseOverLink?.(event, props),
    onMouseOut: event => props.onMouseOutLink?.(event, props),
    onKeyDown: event => props.onKeyDownLink?.(event, props)
  };

  const lineCenterPos = center(start, end);
  const linePosition: CSSProperties = {
    width: len(start, end),
    borderBottomWidth: props.size,
    top: lineCenterPos.y,
    left: lineCenterPos.x,
    transform: `translate(-50%, -50%) rotate(${deg(start, end)}deg)`
  };

  const lineProps: HTMLAttributes<HTMLDivElement> = {
    ...eventHandlers,
    style: {
      borderBottomColor: props.color,
      borderBottomStyle: props.lineType,
      ...linePosition,
      ...props.lineStyle
    },
    tabIndex: props.focusable ? 0 : undefined,
    "aria-label": props.lineAriaLabel
  };

  const needClickHelper: boolean =
    !!props.onClickLink &&
    (!isFinite(props.size!) || props.size! < CLICK_HELPER_THRESHOLD);

  const clickHelperLineStyle: CSSProperties = {
    ...lineProps.style,
    opacity: 0,
    borderBottomWidth: CLICK_HELPER_THRESHOLD
  };
  const clickHelperLineProps: React.HTMLAttributes<HTMLDivElement> = {
    ...eventHandlers,
    style: clickHelperLineStyle
  };

  return (
    <div className={LINK_CLASS_ROOT} style={props.style}>
      <div className={LINK_CLASS_LINE} id={props.id} {...lineProps}></div>
      {needClickHelper && <div {...clickHelperLineProps}></div>}
    </div>
  );
};
