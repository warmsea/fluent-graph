import React from "react";
import { Meta, Story } from "@storybook/react";
import { Link } from "../../src/components/link/Link";
import { Node } from "../../src/components/node/Node";

const meta: Meta = {
  title: "Subcomponents/Link",
};

export default meta;

export const Basic: Story = (args) => (
  <Link
    id="link"
    start={{ x: 50, y: 50 }}
    end={{ x: 200, y: 100 }}
    size={args.size}
    color={args.color}
    lineType={args.lineType}
    onClickLink={args.onClickLink}
  />
);
Basic.argTypes = {
  size: {
    name: "Link size",
    description: "props.size",
    control: { type: "range", min: 1, max: 15, step: 1 },
    defaultValue: 2,
  },
  color: {
    name: "Link color",
    description: "props.color",
    control: { type: "color" },
    defaultValue: "gray",
  },
  lineType: {
    name: "Link type",
    description: "props.lineType",
    control: {
      type: "inline-radio",
      options: ["solid", "dotted", "dashed", "double"],
    },
    defaultValue: "solid",
  },
  onClickLink: {
    action: "click",
  },
};

export const Offsets: Story = (args) => (
  <div style={{ position: "absolute" }}>
    <Node
      id="start"
      style={{
        position: "absolute",
        left: 50,
        top: 50,
      }}
    />
    <Node
      id="end"
      style={{
        position: "absolute",
        left: 200,
        top: 100,
      }}
    />
    <Link
      id="link"
      color={"red"}
      start={{ x: 50, y: 50, offset: args.startOffset }}
      end={{ x: 200, y: 100, offset: args.endOffset }}
      style={{ zIndex: 10 }}
    />
  </div>
);
Offsets.argTypes = {
  startOffset: {
    name: "Start offset",
    description: "props.start.offset",
    control: {
      type: "range",
      min: -50,
      max: 50,
      step: 5,
    },
    defaultValue: 0,
  },
  endOffset: {
    name: "End offset",
    description: "props.end.offset",
    control: { type: "range", min: -50, max: 50, step: 5 },
    defaultValue: 0,
  },
};
