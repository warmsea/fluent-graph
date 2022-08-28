import { classNames } from "@warmsea/h";
import some from "lodash/some";
import React, { CSSProperties, FC } from "react";
import { calcDraw, len, deg, center } from "./Link.helper";
import { ILinkProps } from "./Link.types";
import styles from "./Link.scss";
import { DivAttributes } from "../../utilities";

const DEFAULT_LINE_SIZE = 2;
const DEFAULT_LINE_COLOR = "gray";
const DEFAULT_LINE_TYPE = "solid";
const CLICK_HELPER_THRESHOLD = 12;

export const Link: FC<ILinkProps> = (props: ILinkProps) => {
  const size = props.size ?? DEFAULT_LINE_SIZE;

  const [start, end] = calcDraw(props.start, props.end);
  if (some([start.x, start.y, end.x, end.y].map(isNaN))) {
    return <></>;
  }

  const needClickHelper: boolean = !!props.onClickLink && size < CLICK_HELPER_THRESHOLD;

  const linkCenter = center(start, end);
  const linkLength = len(start, end);
  const linkProps: DivAttributes = {
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

    onClick: (event) => props.onClickLink?.(props, event),
    onMouseOver: (event) => props.onMouseOverLink?.(props, event),
    onMouseOut: (event) => props.onMouseOutLink?.(props, event),
    onKeyDown: (event) => props.onKeyDownLink?.(props, event),

    ...props.linkAttributes,
  };

  const linkInnerStyles: CSSProperties = {
    borderBottomColor: props.color ?? DEFAULT_LINE_COLOR,
    borderBottomStyle: props.linkType ?? DEFAULT_LINE_TYPE,
    borderBottomWidth: size,
    width: "100%",
    ...props.linkStyle,
  };

  return (
    <div className={styles.root} style={props.style} {...props.attributes}>
      <div {...linkProps}>
        <div style={linkInnerStyles}></div>
      </div>
    </div>
  );
};
