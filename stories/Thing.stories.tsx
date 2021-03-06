import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Graph } from '../src';

const meta: Meta = {
  title: 'Welcome',
  component: Graph,
};

export default meta;

const Template: Story = args => (
  <Graph
    id="graph"
    data={{
      nodes: [{ id: "Harry" }, { id: "Sally" }, { id: "Alice" }],
      links: [
          { source: "Harry", target: "Sally" },
          { source: "Harry", target: "Alice" },
      ],
    }}
    {...args}
  />
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
