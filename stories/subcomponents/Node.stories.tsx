import { Meta, Story } from "@storybook/react";
import React from "react";
import { createUseStyles } from "react-jss";
import { Node } from "../../src/components/node/Node";
import { INodeProps } from "../../src/components/node/Node.types";

const meta: Meta = {
  title: "Subcomponents/Node",
};

export default meta;

export const Basic: Story = (args) => (
  <Node
    style={{
      position: "absolute",
      left: 100,
      top: 100,
    }}
    id="node"
    label={args.label}
    size={args.nodeSize}
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

export const CustomizedNode = () => (
  <Node
    style={{
      position: "absolute",
      left: 100,
      top: 100,
    }}
    id="node"
    label="Fluent Graph"
    labelOffset={15}
    onRenderNode={() => (
      <>
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
      </>
    )}
  />
);

export const CustomizedLabel = () => (
  <Node
    style={{
      position: "absolute",
      left: 100,
      top: 100,
    }}
    id="node"
    onRenderLabel={(props: INodeProps) => {
      return (
        <div
          style={{
            ...props.labelStyle,
            transform: "translate(-50%, 0)",
            width: "max-content",
          }}
        >
          Hello, <strong>Fluent Graph</strong>!
        </div>
      );
    }}
  />
);

export const StyledWithClassNames = () => {
  const classNames = createUseStyles({
    node: {
      backgroundColor: "none",
      border: "solid skyblue 5px",
    },
    label: {
      color: "gray",
      fontSize: 12,
      fontWeight: "bold",
      textAlign: "center",
    },
  })();
  return (
    <Node
      style={{
        position: "absolute",
        left: 100,
        top: 100,
      }}
      id="node"
      label="Graph"
      nodeClassName={classNames.node}
      labelClassName={classNames.label}
      size={50}
      labelOffset={-57}
    />
  );
};
