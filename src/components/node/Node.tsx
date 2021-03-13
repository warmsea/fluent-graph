import React, { FC, SVGAttributes, useCallback } from "react";

import { buildSvgSymbol, getLabelPlacementProps } from "./node.helper";
import { INodeProps } from "./Node.types";

/**
 * Node component is responsible for encapsulating node render.
 * @example
 * const onClickNode = function(nodeId) {
 *     window.alert('Clicked node', nodeId);
 * };
 *
 * const onRightClickNode = function(nodeId) {
 *     window.alert('Right clicked node', nodeId);
 * }
 *
 * const onMouseOverNode = function(nodeId) {
 *     window.alert('Mouse over node', nodeId);
 * };
 *
 * const onMouseOutNode = function(nodeId) {
 *     window.alert('Mouse out node', nodeId);
 * };
 *
 * const generateCustomNode(node) {
 *     return <CustomComponent node={node} />;
 * }
 *
 * <Node
 *     id='nodeId'
 *     cx=22
 *     cy=22
 *     fill='green'
 *     fontSize=10
 *     fontColor='black'
 *     fontWeight='normal'
 *     labelOffset=90
 *     label='label text'
 *     labelPosition='top'
 *     opacity=1
 *     renderLabel=true
 *     size=200
 *     stroke='none'
 *     strokeWidth=1.5
 *     svg='assets/my-svg.svg'
 *     type='square'
 *     viewGenerator={generateCustomNode}
 *     className='node'
 *     onClickNode={onClickNode}
 *     onRightClickNode={onRightClickNode}
 *     onMouseOverNode={onMouseOverNode}
 *     onMouseOutNode={onMouseOutNode} />
 */
export const Node: FC<INodeProps> = (props: INodeProps) => {
  const handleOnClickNode = useCallback(
    event => props.onClickNode?.(event, props.id),
    [props.onClickNode, props.id]
  );

  const handleOnRightClickNode = useCallback(
    event => props.onRightClickNode?.(event, props.id),
    [props.onRightClickNode, props.id]
  );

  const handleOnMouseOverNode = useCallback(
    event => props.onMouseOverNode?.(event, props.id),
    [props.onMouseOverNode, props.id]
  );

  const handleOnMouseOutNode = useCallback(
    event => props.onMouseOut?.(event, props.id),
    [props.onMouseOut, props.id]
  );

  const nodeProps: SVGAttributes<SVGElement> = {
    style: props.nodeStyle,

    onClick: handleOnClickNode,
    onContextMenu: handleOnRightClickNode,
    onMouseOut: handleOnMouseOutNode,
    onMouseOver: handleOnMouseOverNode
  };

  const textProps: SVGAttributes<SVGTextElement> = {
    ...getLabelPlacementProps(props.labelOffset, props.labelPosition),
    style: props.labelStyle
  };

  let size = props.size;

  let gtx = props.cx,
    gty = props.cy,
    labelElement: JSX.Element,
    node: JSX.Element;

  if (props.svg || props.viewGenerator) {
    const { size } = props;
    const tx = size / 2;
    const ty = size / 2;
    const transform = `translate(${tx},${ty})`;

    labelElement = (
      <text {...textProps} transform={transform}>
        {props.label}
      </text>
    );

    // By default, if a view generator is set, it takes precedence over any svg image url
    if (props.viewGenerator) {
      node = (
        <svg {...nodeProps} width={size} height={size}>
          <foreignObject x="0" y="0" width="100%" height="100%">
            <section
              style={{
                height: size,
                width: size,
                backgroundColor: "transparent"
              }}
            >
              {props.viewGenerator(props)}
            </section>
          </foreignObject>
        </svg>
      );
    } else {
      // props.svg
      node = (
        <image {...nodeProps} href={props.svg} width={size} height={size} />
      );
    }

    // svg offset transform regarding svg width/height
    gtx -= tx;
    gty -= ty;
  } else {
    nodeProps.d = buildSvgSymbol(size, props.type);
    nodeProps.style = { ...props.nodeStyle };

    labelElement = <text {...textProps}>{props.label}</text>;
    node = <path tabIndex={0} {...nodeProps} />;
  }

  const gProps: SVGAttributes<SVGGElement> = {
    id: props.id,
    className: props.className,
    cx: props.cx,
    cy: props.cy,
    transform: `translate(${gtx},${gty})`
  };

  return (
    <g {...gProps}>
      {node}
      {props.label && labelElement}
    </g>
  );
};
