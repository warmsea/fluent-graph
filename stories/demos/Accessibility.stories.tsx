import { FocusZone, FocusZoneDirection } from "@fluentui/react";
import { Meta, Story } from "@storybook/react";
import React from "react";
import { Graph, IGraphProps } from "../../src";

const meta: Meta = {
  title: "Demos/Accessibility",
};

export default meta;

export const FocusableElements: Story = (args) => {
  const graphProps: IGraphProps = {
    id: "graph",
    nodes: [{ id: "Fluent Graph" }, { id: "React" }, { id: "D3" }],
    links: [
      { source: "Fluent Graph", target: "React" },
      { source: "Fluent Graph", target: "D3" },
    ],
    nodeConfig: {
      nodeAttributes: {
        tabIndex: args.focusableNodes === "Focusable nodes" ? 0 : undefined,
      },
      labelStyle: {
        padding: "2px 10px",
        backgroundColor: "#eeeeee",
        borderRadius: 10,
      },
      labelAttributes: {
        tabIndex: args.focusableNodes === "Focusable labels" ? 0 : undefined,
      },
    },
    linkConfig: {
      linkAttributes: {
        tabIndex: args.focusableLinks === "Focusable" ? 0 : undefined,
      },
    },
  };
  return <Graph {...graphProps} />;
};
FocusableElements.argTypes = {
  focusableNodes: {
    name: "Nodes",
    control: {
      type: "inline-radio",
      options: ["Focusable nodes", "Focusable labels", "Not focusable"],
    },
    defaultValue: "Focusable labels",
  },
  focusableLinks: {
    name: "Links",
    control: {
      type: "inline-radio",
      options: ["Focusable", "Not focusable"],
    },
    defaultValue: "Not focusable",
  },
};

export const WorkWithFocusZone: Story = (args) => {
  const graphProps: IGraphProps = {
    id: "graph",
    nodes: [{ id: "Fluent Graph" }, { id: "React" }, { id: "D3" }],
    links: [
      { source: "Fluent Graph", target: "React" },
      { source: "Fluent Graph", target: "D3" },
    ],
    nodeConfig: {
      nodeAttributes: {
        "data-is-focusable": args.focusableNodes === "Focusable nodes",
      },
      labelStyle: {
        padding: "2px 10px",
        backgroundColor: "#eeeeee",
        borderRadius: 10,
      },
      labelAttributes: {
        "data-is-focusable": args.focusableNodes === "Focusable labels",
      },
    },
    linkConfig: {
      linkAttributes: {
        "data-is-focusable": args.focusableLinks === "Focusable",
      },
    },
  };
  return (
    <FocusZone direction={FocusZoneDirection.horizontal} isCircularNavigation>
      <Graph {...graphProps} />
    </FocusZone>
  );
};
WorkWithFocusZone.argTypes = {
  focusableNodes: {
    name: "Nodes",
    control: {
      type: "inline-radio",
      options: ["Focusable nodes", "Focusable labels", "Not focusable"],
    },
    defaultValue: "Focusable nodes",
  },
  focusableLinks: {
    name: "Links",
    control: {
      type: "inline-radio",
      options: ["Focusable", "Not focusable"],
    },
    defaultValue: "Focusable",
  },
};
