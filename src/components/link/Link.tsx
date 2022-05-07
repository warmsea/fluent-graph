import { classNames } from "@warmsea/h";
import React, { CSSProperties, FC, HTMLAttributes } from "react";
import { calcDraw, len, deg, center } from "./Link.helper";
import { ILinkProps } from "./Link.types";
import styles from "./Link.scss";

export const CLICK_HELPER_THRESHOLD = 12;

export const Link: FC<ILinkProps> = (props: ILinkProps) => {
  const size = props.size ?? 2;

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

  const needClickHelper: boolean = !!props.onClickLink && size < CLICK_HELPER_THRESHOLD;

  const linkCenter = center(start, end);
  const linkLength = len(start, end);
  const linkProps: HTMLAttributes<HTMLDivElement> = {
    className: classNames(styles.link, props.linkClassName),
    style: {
      width: linkLength,
      height: size,
      top: linkCenter.y,
      left: linkCenter.x,
      transform: `translate(-50%, -50%) rotate(${deg(start, end)}deg)`,
      ...(!!props.onClickLink && { cursor: "pointer" }),
      ...(needClickHelper && { height: CLICK_HELPER_THRESHOLD }),
    },
    ...eventHandlers,
    ...props.linkProps,
  };

  const linkInnerStyles: CSSProperties = {
    borderBottomColor: props.color ?? "gray",
    borderBottomStyle: props.linkType ?? "solid",
    borderBottomWidth: size,
    width: "100%",
    ...props.linkStyle,
  };

  return (
    <div className={styles.root} style={props.style}>
      <div {...linkProps}>
        <div style={linkInnerStyles}></div>
      </div>
    </div>
  );
};
