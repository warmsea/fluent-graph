import React from "react";
import { Meta, Story } from "@storybook/react";
import { Node, NODE_CLASS_NODE } from "../../../src/components/node/Node";
import { INodeProps } from "../../../src/components/node/Node.types";

const meta: Meta = {
  title: "Subcomponents/Node",
};

export default meta;

export const Basic: Story = (args) => (
  <Node
    id="node"
    label={args.label}
    size={args.nodeSize}
    style={{
      position: "absolute",
      left: 100,
      top: 100,
    }}
    nodeStyle={{
      backgroundColor: args.nodeColor,
    }}
    labelStyle={{
      color: args.labelColor,
      fontFamily: args.labelFontFamily,
      fontWeight: args.labelFontWeight,
      fontSize: args.labelFontSize,
      padding: `2px ${args.labelFontSize / 2}px`,
      ...(args.labelBorder
        ? {
            border: `1px solid ${args.labelColor}`,
            borderRadius: args.labelFontSize,
          }
        : {}),
    }}
    labelOffset={args.labelOffset}
    onClickNode={args.onClickNode}
  />
);
Basic.argTypes = {
  label: {
    name: "Label",
    description: "props.label",
    control: { type: "text" },
    defaultValue: "Fluent Graph",
  },
  nodeSize: {
    name: "Node size",
    description: "props.size",
    control: { type: "range", min: 10, max: 50, step: 10 },
    defaultValue: 20,
  },
  nodeColor: {
    name: "Node color",
    description: "props.nodeStyle.backgroundColor",
    control: { type: "color" },
    defaultValue: "lightgray",
  },
  labelColor: {
    name: "Label color",
    description: "props.labelStyle.color",
    control: { type: "color" },
    defaultValue: "black",
  },
  labelFontFamily: {
    name: "Label font family",
    description: "props.labelStyle.fontFamily",
    control: {
      type: "select",
      options: [
        "'Courier New', Courier, monospace",
        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        "Georgia, 'Times New Roman', Times, serif",
        "cursive",
        "fantasy",
      ],
    },
    defaultValue: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  labelFontWeight: {
    name: "Label font weight",
    description: "props.labelStyle.fontWeight",
    control: {
      type: "inline-radio",
      options: ["normal", "bold"],
    },
    defaultValue: "normal",
  },
  labelFontSize: {
    name: "Label font size",
    description: "props.labelStyle.fontSize",
    control: {
      type: "range",
      min: 10,
      max: 24,
      step: 1,
    },
    defaultValue: 14,
  },
  labelBorder: {
    name: "Label border",
    description: "props.labelStyle.border",
    control: { type: "boolean" },
    defaultValue: false,
  },
  labelOffset: {
    name: "Label offset",
    description: "props.labelOffset",
    control: {
      type: "range",
      min: -50,
      max: 50,
      step: 1,
    },
    defaultValue: 0,
  },
  onClickNode: {
    action: "click",
  },
};

interface ITemplateArgs {
  nodeProps: INodeProps;
}

const Template: Story<ITemplateArgs> = (args: ITemplateArgs) => (
  <div style={{ position: "absolute" }}>
    <Node
      style={{
        position: "absolute",
        left: 100,
        top: 100,
      }}
      {...args.nodeProps}
    />
  </div>
);

export const CustomizeNode: Story<ITemplateArgs> = Template.bind({});
CustomizeNode.args = {
  nodeProps: {
    id: "Fluent Graph",
    label: "Fluent Graph",
    labelOffset: 15,
    onRenderNode: () => {
      return (
        <div className={NODE_CLASS_NODE}>
          <div
            style={{
              position: "absolute",
              transform: "translate(-50%, -50%)",
              boxSizing: "border-box",
              backgroundColor: "#d3d3d3",
              width: 20,
              height: 20,
              borderRadius: 10,
            }}
          />
          <div
            style={{
              position: "absolute",
              transform: "translate(-50%, -50%)",
              boxSizing: "border-box",
              backgroundColor: "none",
              border: "solid 2px #d3d3d3",
              width: 30,
              height: 30,
              borderRadius: 15,
            }}
          />
        </div>
      );
    },
  },
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
    },
  },
};

export const Styled: Story<ITemplateArgs> = Template.bind({});
Styled.args = {
  nodeProps: {
    id: "Graph",
    size: 50,
    label: "Graph",
    nodeStyle: {
      backgroundColor: "none",
      border: "solid skyblue 5px",
    },
    labelStyle: {
      color: "gray",
      fontSize: 12,
      fontWeight: "bold",
      textAlign: "center",
    },
    labelOffset: -57,
  },
};
