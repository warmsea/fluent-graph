import { isNumber } from "lodash";
import React, { CSSProperties, FC, HTMLAttributes } from "react";
import { css, mergeConfig } from "../../utils";
import { calcDraw, len, deg, center } from "./Link.helper";
import { ILinkCommonConfig, ILinkProps } from "./Link.types";

export const LINK_CLASS_ROOT = "fg-link-root";
export const LINK_CLASS_LINE = "fg-link-line";
export const DEFAULT_LINK_PROPS: ILinkCommonConfig = {
  size: 2,
  color: "gray",
  lineType: "solid",
  style: {
    position: "absolute",
    zIndex: 1,
  },
  lineStyle: {
    position: "absolute",
    background: "transparent",
  },
};
export const CLICK_HELPER_THRESHOLD = 12;

export const Link: FC<ILinkProps> = (props: ILinkProps) => {
  props = mergeConfig(DEFAULT_LINK_PROPS, props);
  const [start, end] = calcDraw(props.start, props.end);
  if (isNaN(start.x) || isNaN(start.y) || isNaN(end.x) || isNaN(end.y)) {
    return <></>;
  }

  const eventHandlers: HTMLAttributes<HTMLElement> = {
    onClick: (event) => props.onClickLink?.(event, props),
    onMouseOver: (event) => props.onMouseOverLink?.(event, props),
    onMouseOut: (event) => props.onMouseOutLink?.(event, props),
    onKeyDown: (event) => props.onKeyDownLink?.(event, props),
  };

  const needClickHelper: boolean =
    !!props.onClickLink && isNumber(props.size) && props.size < CLICK_HELPER_THRESHOLD;

  const lineCenterPos = center(start, end);
  const lineLength = len(start, end);
  const lineProps: HTMLAttributes<HTMLDivElement> = {
    ...eventHandlers,
    ...props.lineProps,
    className: css(LINK_CLASS_LINE, props.lineProps?.className),
    style: {
      position: "absolute",
      width: lineLength,
      height: props.size,
      top: lineCenterPos.y,
      left: lineCenterPos.x,
      transform: `translate(-50%, -50%) rotate(${deg(start, end)}deg)`,
      display: "flex",
      alignItems: "center",
      ...(needClickHelper && {
        cursor: "pointer",
        height: CLICK_HELPER_THRESHOLD,
      }),
    },
  };

  const lineInnerStyles: CSSProperties = {
    borderBottomColor: props.color,
    borderBottomStyle: props.lineType,
    borderBottomWidth: props.size,
    width: "100%",
    ...props.lineStyle,
  };

  return (
    <div className={LINK_CLASS_ROOT} style={props.style}>
      <div {...lineProps}>
        <div style={lineInnerStyles}></div>
      </div>
    </div>
  );
};
