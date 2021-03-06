import React, { FC } from "react";

export interface IMarkerProps {
  id?: string;
  refX?: string | number;
  markerWidth?: string | number;
  markerHeight?: string | number;
  fill?: string;
}

/**
 * Market component provides configurable interface to marker definition.
 * @example
 *
 * <Marker id="marker-id" fill="black" />
 */
export const Marker: FC<IMarkerProps> = (props: IMarkerProps) => {
  return (
    <marker
      className="marker"
      id={props.id}
      viewBox="0 -5 10 10"
      refX={props.refX}
      refY="0"
      markerWidth={props.markerWidth}
      markerHeight={props.markerHeight}
      orient="auto"
      fill={props.fill}
    >
      <path d="M0,-5L10,0L0,5" />
    </marker>
  );
};
