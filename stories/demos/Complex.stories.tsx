import React, { CSSProperties, FC } from "react";
import { Meta } from "@storybook/react";
import { Graph } from "../../src";
import { IGraphProps, IGraphPropsNode } from "../../src/components/graph/Graph.types";
import { ILinkType } from "../../src/components/link/Link.types";

const meta: Meta = {
  title: "Demos/Complex",
};
export default meta;

const nodes: [string, number, string, string?, Partial<IGraphPropsNode>?][] = [
  [
    "Mark 8",
    3,
    "#04787c",
    "solid",
    {
      force: {
        fx: 0,
        fy: 0,
      },
      labelStyle: {
        fontWeight: "bold",
      },
    },
  ],
  ["Structural Integrity", 2, "#c239b3"],
  ["Flight Operations", 1, "#c239b3"],
  ["3D Modeling", 1, "#5c2d91", "circle"],
  ["GIS Mapping", 1, "#5c2d91"],
  ["Geothermal", 2, "#5c2d91"],
  ["Aerial", 2, "#5c2d91"],
  ["Atlas", 2, "#ca500f", "circle"],
  ["Elements", 1, "#ca500f", "circle"],
  [
    "SOAR",
    2,
    "#ca500f",
    "circle",
    {
      label: "Sustainable Operations Agricultural Reliability",
    },
  ],
  ["Delta", 3, "#ca500f"],
  ["Swiftly", 3, "#ca500f"],
  ["Fjord", 2, "#4f6bed", "circle"],
  ["Juno", 1, "#4f6bed", "circle"],
  ["Data Visualization", 2, "#4f6bed", "circle"],
  ["Digital Surfaces", 2, "#4f6bed"],
  ["Survey Intelligence", 2, "#4f6bed"],
  [
    "COR",
    3,
    "#498204",
    "circle",
    {
      label: "Construction Operations Reliability",
    },
  ],
  ["Spaces", 3, "#498204", "circle"],
  ["Partners", 3, "#498204"],
];

const links: [string, string, number, ILinkType?][] = [
  ["Mark 8", "Structural Integrity", 5, "dashed"],
  ["Mark 8", "Flight Operations", 5],
  ["Mark 8", "3D Modeling", 4, "dashed"],
  ["Mark 8", "GIS Mapping", 4, "dashed"],
  ["Mark 8", "Geothermal", 4],
  ["Mark 8", "Aerial", 4, "dashed"],
  ["Mark 8", "Atlas", 3, "dashed"],
  ["Mark 8", "Elements", 3, "dashed"],
  ["Mark 8", "SOAR", 3, "dashed"],
  ["Mark 8", "Delta", 3, "dashed"],
  ["Mark 8", "Swiftly", 3],
  ["Mark 8", "Fjord", 2, "dashed"],
  ["Mark 8", "Data Visualization", 2, "dashed"],
  ["Mark 8", "Juno", 2],
  ["Mark 8", "Digital Surfaces", 2],
  ["Mark 8", "Survey Intelligence", 3],
  ["Mark 8", "COR", 1, "dashed"],
  ["Mark 8", "Spaces", 1, "dashed"],
  ["Mark 8", "Partners", 1],
  ["Flight Operations", "Atlas", 2, "dashed"],
  ["3D Modeling", "SOAR", 1, "dashed"],
  ["GIS Mapping", "SOAR", 1, "dashed"],
  ["Aerial", "Swiftly", 2],
  ["Atlas", "Fjord", 1, "dashed"],
  ["Atlas", "COR", 1, "dashed"],
  ["Delta", "Juno", 1],
  ["Swiftly", "Digital Surfaces", 2],
  ["Swiftly", "Partners", 1],
  ["Survey Intelligence", "COR", 1, "dashed"],
  ["Elements", "Spaces", 1, "dashed"],
  ["Data Visualization", "Spaces", 1, "dashed"],
  ["Geothermal", "Partners", 1],
];

export const Example1: FC = () => {
  const graphProps: IGraphProps = {
    id: "graph",
    config: {
      width: 800,
      height: 600,
    },
    nodes: nodes.map((n) => {
      let size: number;
      let labelOffset: number;
      switch (n[1]) {
        case 3:
          size = 32;
          labelOffset = -16;
          break;
        case 2:
          size = 20;
          labelOffset = -10;
          break;
        case 1:
        default:
          size = 12;
          labelOffset = -6;
      }
      let nodeStyle: CSSProperties;
      if (n[3] && n[3] === "circle") {
        nodeStyle = { backgroundColor: "white", border: `solid 2px ${n[2]}` };
      } else {
        nodeStyle = { backgroundColor: n[2] };
      }
      return {
        id: n[0],
        size,
        labelOffset,
        nodeStyle,
        ...n[4],
      };
    }),
    links: links.map((l) => ({
      source: l[0],
      target: l[1],
      size: l[2],
      lineType: l[3] ?? "solid",
    })),
    nodeConfig: {
      nodeStyle: {
        boxShadow: "0 2px 4px grey",
      },
      labelStyle: {
        fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        fontSize: 12,
      },
      labelOffset: -4,
    },
    linkConfig: {
      lineStyle: {
        borderBottomColor: "rgb(4, 120, 124, .5)",
      },
    },
  };
  return <Graph {...graphProps} />;
};
