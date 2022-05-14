import React from "react";
import { Meta, Story } from "@storybook/react";
import { Graph } from "../../src";
import { IGraphProps } from "../../src/components/graph/Graph.types";

const meta: Meta = {
  title: "Demos/Basic",
};

export default meta;

interface ITemplateArgs {
  graphProps: IGraphProps;
}

const Template: Story<ITemplateArgs> = (args: ITemplateArgs) => <Graph {...args.graphProps} />;

export const Simple: Story = () => {
  const graphProps: IGraphProps = {
    id: "graph",
    nodes: [{ id: "Fluent Graph" }, { id: "React" }, { id: "D3" }],
    links: [
      { source: "Fluent Graph", target: "React" },
      { source: "Fluent Graph", target: "D3" },
    ],
  };
  return <Graph {...graphProps} />;
};

export const Styled: Story<ITemplateArgs> = Template.bind({});
Styled.args = {
  graphProps: {
    id: "graph",
    nodes: [{ id: "Fluent Graph" }, { id: "React" }, { id: "D3" }],
    links: [
      { source: "Fluent Graph", target: "React" },
      { source: "Fluent Graph", target: "D3" },
    ],
    nodeConfig: {
      nodeStyle: {
        fill: "skyblue",
      },
      labelStyle: {
        fill: "darkgray",
        fontSize: 12,
      },
    },
    linkConfig: {
      linkStyle: {
        borderColor: "deepskyblue",
      },
    },
  },
};

export const Loop: Story<ITemplateArgs> = Template.bind({});
Loop.args = {
  graphProps: {
    id: "graph",
    nodes: [{ id: "A" }, { id: "B1" }, { id: "B2" }, { id: "C" }],
    links: [
      { source: "A", target: "B1" },
      { source: "A", target: "B2" },
      { source: "B1", target: "C" },
      { source: "B2", target: "C" },
    ],
  },
};

export const FixedRootNode: Story = () => {
  const graphProps: IGraphProps = {
    id: "graph",
    nodes: [{ id: "Fluent Graph", force: { fx: 0, fy: 0 } }, { id: "React" }, { id: "D3" }],
    links: [
      { source: "Fluent Graph", target: "React" },
      { source: "Fluent Graph", target: "D3" },
    ],
  };
  return <Graph {...graphProps} />;
};
