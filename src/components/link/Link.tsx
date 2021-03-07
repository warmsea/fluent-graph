import React, { CSSProperties, FC, SVGAttributes, useCallback } from "react";

import { ILinkProps } from './Link.types';

/**
 * Link component is responsible for encapsulating link render.
 * @example
 * const onClickLink = function(source, target) {
 *      window.alert(`Clicked link between ${source} and ${target}`);
 * };
 *
 * const onRightClickLink = function(source, target) {
 *      window.alert(`Right clicked link between ${source} and ${target}`);
 * };
 *
 * const onMouseOverLink = function(source, target) {
 *      window.alert(`Mouse over in link between ${source} and ${target}`);
 * };
 *
 * const onMouseOutLink = function(source, target) {
 *      window.alert(`Mouse out link between ${source} and ${target}`);
 * };
 *
 * <Link
 *     d="M1..."
 *     source="idSourceNode"
 *     target="idTargetNode"
 *     markerId="marker-small"
 *     strokeWidth=1.5
 *     stroke="green"
 *     className="link"
 *     opacity=1
 *     mouseCursor="pointer"
 *     onClickLink={onClickLink}
 *     onRightClickLink={onRightClickLink}
 *     onMouseOverLink={onMouseOverLink}
 *     onMouseOutLink={onMouseOutLink} />
 */
export const Link: FC<ILinkProps> = (props: ILinkProps) => {
  const handleOnClickLink = useCallback(event => {
    props.onClickLink?.(event, props.source, props.target);
  }, [props.onClickLink]);

  const handleOnRightClickLink = useCallback(event => {
    props.onRightClickLink?.(event, props.source, props.target);
  }, [props.onRightClickLink]);

  const handleOnMouseOverLink = useCallback(event => {
    props.onMouseOverLink?.(event, props.source, props.target);
  }, [props.onMouseOverLink]);

  const handleOnMouseOutLink = useCallback(event => {
    props.onMouseOutLink?.(event, props.source, props.target);
  }, [props.onMouseOutLink]);

  const handleOnKeyDownLink = useCallback(event => {
    props.onKeyDownLink?.(event, props.source, props.target);
  }, [props.onKeyDownLink]);

  const lineStyle: CSSProperties = {
    cursor: props.mouseCursor,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    opacity: props.opacity,
    fill: "none",
  };

  const lineProps: SVGAttributes<SVGPathElement> = {
    className: props.className,
    d: props.d,
    style: lineStyle,
    strokeDasharray: props.linkStrokeDashArray?.(props.source, props.target),
    markerEnd: props.markerId ? `url(#${props.markerId})` : undefined ,

    onClick: handleOnClickLink,
    onContextMenu: handleOnRightClickLink,
    onMouseOut: handleOnMouseOutLink,
    onMouseOver: handleOnMouseOverLink,
    onKeyDown: handleOnKeyDownLink,

    tabIndex: props.linkFocusable ? 0 : undefined,
    "aria-label": props.getLinkAriaLabel?.(props.source, props.target),
  };

  const { label, id } = props;
  const textProps: SVGAttributes<SVGTextElement> = {
    dy: -1,
    style: {
      fill: props.fontColor,
      fontSize: props.fontSize,
      fontWeight: props.fontWeight as any,
      textAnchor: "middle",
    },
  };

  const STROKE_WIDTH_LIMIT: number = 12;

  const needClickHelperPath: boolean = !!props.onClickLink && props.strokeWidth < STROKE_WIDTH_LIMIT;

  const clickHelperLineStyle: CSSProperties = {
    cursor: props.mouseCursor,
    strokeWidth: STROKE_WIDTH_LIMIT,
    stroke: props.stroke,
    opacity: 0,
  };
  const clickHelperLineProps: SVGAttributes<SVGPathElement> = {
    className: props.className,
    style: clickHelperLineStyle,
    d: props.d,
    onClick: handleOnClickLink,
  };
  return (
    <g>
      <path {...lineProps} id={id} />
      {needClickHelperPath && <path {...clickHelperLineProps} id={`clickHelper-${id}`} />}
      {label && (
        <text {...textProps}>
          <textPath href={`#${id}`} startOffset="50%">
            {label}
          </textPath>
        </text>
      )}
    </g>
  );
};
