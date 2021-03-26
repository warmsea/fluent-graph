import * as d3 from "d3";
import { merge } from "lodash";
import React, { FC, SVGAttributes, useCallback } from "react";

import { getLabelPlacementProps } from "./node.helper";
import { INodeCommonConfig, INodeProps } from "./Node.types";

export const DEFAULT_NODE_PROPS: INodeCommonConfig = {
  size: 20,
  nodeStyle: {
    fill: "#d3d3d3"
  },
  labelPosition: "bottom"
};

export const Node: FC<INodeProps> = (props: INodeProps) => {
  props = merge({}, DEFAULT_NODE_PROPS, props);

  const onRenderNode = useCallback((props: INodeProps) => {
    if (props.onRenderNode) {
      return props.onRenderNode(props);
    } else {
      const diameter: number = props.size ?? DEFAULT_NODE_PROPS.size!;
      const nodeProps: SVGAttributes<SVGElement> = {
        d:
          d3
            .symbol()
            .type(d3.symbolCircle)
            .size(Math.pow((Math.PI * diameter) / 4, 2))() ?? undefined,
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
    className: props.className
  };

  return (
    <g {...gProps}>
      <g
        className="fg-node"
        onClick={event => props.onClickNode?.(props, event)}
        onContextMenu={event => props.onContextMenu?.(props, event)}
        onMouseOver={event => props.onMouseOverNode?.(props, event)}
        onMouseOut={event => props.onMouseOutNode?.(props, event)}
        data-nodeid={props.id}
      >
        {onRenderNode(props)}
      </g>
      {(props.label || props.onRenderLabel) && onRenderLabel(props)}
    </g>
  );
};
