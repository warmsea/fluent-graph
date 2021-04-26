import React from "react";
import { Meta, Story } from "@storybook/react";
import { FC, useState } from "react";
import { Node } from "../../src";

const meta: Meta = {
  title: "Node: Events"
};

export default meta;

const CountingComponent: FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div style={{ position: "absolute" }}>
      <p>You clicked {count} times.</p>
      <Node
        style={{
          position: "absolute",
          left: 100,
          top: 100
        }}
        id="Click the node!"
        label="Click the node!"
        onClickNode={() => {
          setCount(count + 1);
        }}
      />
    </div>
  );
};

export const ClickNode: Story = () => <CountingComponent />;
