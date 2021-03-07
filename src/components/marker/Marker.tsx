import React, { FC, SVGAttributes } from "react";

export type IMarkerProps = SVGAttributes<SVGMarkerElement>;

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
      viewBox="0 -5 10 10"
      refY="0"
      orient="auto"
      {...props}
    >
      <path d="M0,-5L10,0L0,5" />
    </marker>
  );
};
