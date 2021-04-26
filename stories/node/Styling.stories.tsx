import React from "react";
import { Meta, Story } from "@storybook/react";
import { Node, NODE_CLASS_NODE } from "../../src/components/node/Node";
import { INodeProps } from "../../src/components/node/Node.types";
import { Args, BaseStory } from "@storybook/addons";
import { StoryFnReactReturnType } from "@storybook/react/dist/client/preview/types";

const meta: Meta = {
  title: "Node: Styling"
};

export default meta;

interface ITemplateArgs extends BaseStory<Args, StoryFnReactReturnType> {
  nodeProps: INodeProps;
}

const Template: Story<ITemplateArgs> = (args: ITemplateArgs) => (
  <div style={{ position: "absolute" }}>
    <Node
      style={{
        position: "absolute",
        left: 100,
        top: 100
      }}
      {...args.nodeProps}
    />
  </div>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Basic: Story<ITemplateArgs> = Template.bind({});
Basic.args = {
  nodeProps: {
    id: "Fluent Graph",
    label: "Fluent Graph"
  }
};

export const Styled: Story<ITemplateArgs> = Template.bind({});
Styled.args = {
  nodeProps: {
    id: "Graph",
    size: 50,
    label: "Graph",
    nodeStyle: {
      backgroundColor: "none",
      border: "solid skyblue 5px"
    },
    labelStyle: {
      color: "gray",
      fontSize: 12,
      fontWeight: "bold",
      textAlign: "center"
    },
    labelOffset: -57
  }
};

export const CustomizeNode: Story<ITemplateArgs> = Template.bind({});
CustomizeNode.args = {
  nodeProps: {
    id: "Fluent Graph",
    label: "Fluent Graph",
    labelOffset: 15,
    onRenderNode: (props: INodeProps) => {
      return (
        <div className={NODE_CLASS_NODE}>
          <div
            style={{
              ...props.nodeStyle,
              position: "absolute",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#d3d3d3",
              width: 20,
              height: 20,
              borderRadius: 10
            }}
          />
          <div
            style={{
              ...props.nodeStyle,
              position: "absolute",
              transform: "translate(-50%, -50%)",
              backgroundColor: "none",
              border: "solid 2px #d3d3d3",
              width: 30,
              height: 30,
              borderRadius: 15
            }}
          />
        </div>
      );
    }
  }
};

export const CustomizeLabel: Story<ITemplateArgs> = Template.bind({});
CustomizeLabel.args = {
  nodeProps: {
    id: "Fluent Graph",
    onRenderLabel: (props: INodeProps) => {
      return (
        <div style={{ ...props.labelStyle, transform: "translate(-50%, 0)" }}>
          Hello, <strong>Fluent Graph</strong>!
        </div>
      );
    }
  }
};
