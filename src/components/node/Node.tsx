import * as d3 from "d3";
import { merge } from "lodash";
import React, { FC, SVGAttributes, useCallback } from "react";
import { DEFAULT_NODE_PROPS } from "./node.const";

import { getLabelPlacementProps } from "./node.helper";
import { INodeProps } from "./Node.types";

export const Node: FC<INodeProps> = (props: INodeProps) => {
  props = merge({}, DEFAULT_NODE_PROPS, props);

  const handleOnClickNode = useCallback(
    event => props.onClickNode?.(event, props.id),
    [props.onClickNode, props.id]
  );

  const handleOnMouseOverNode = useCallback(
    event => props.onMouseOverNode?.(event, props.id),
    [props.onMouseOverNode, props.id]
  );

  const handleOnMouseOutNode = useCallback(
    event => props.onMouseOutNode?.(event, props.id),
    [props.onMouseOutNode, props.id]
  );

  const onRenderNode = useCallback((props: INodeProps) => {
    if (props.onRenderNode) {
      return props.onRenderNode(props);
    } else {
      const nodeProps: SVGAttributes<SVGElement> = {
        d:
          d3
            .symbol()
            .type(d3.symbolCircle)
            .size(props.size ?? DEFAULT_NODE_PROPS.size!)() ?? undefined,
        style: props.nodeStyle
      };
      return <path tabIndex={0} {...nodeProps} />;
    }
  }, []);

  const onRenderLabel = useCallback((props: INodeProps) => {
    if (props.onRenderLabel) {
      return props.onRenderLabel(props);
    } else {
      const labelProps: SVGAttributes<SVGElement> = {
        ...getLabelPlacementProps(props.labelPosition, props.labelOffset),
        style: props.labelStyle
      };
      return <text {...labelProps}>{props.label}</text>;
    }
  }, []);

  const gProps: SVGAttributes<SVGGElement> = {
    id: props.id,
    className: props.className,
    transform: `translate(${props.x ?? 0}, ${props.y ?? 0})`
  };

  return (
    <g {...gProps}>
      <g
        onClick={handleOnClickNode}
        onMouseOver={handleOnMouseOverNode}
        onMouseOut={handleOnMouseOutNode}
      >
        {onRenderNode(props)}
      </g>
      {(props.label || props.onRenderLabel) && onRenderLabel(props)}
    </g>
  );
};
