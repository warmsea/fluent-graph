import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Graph } from '../src';
import { Args, BaseStory } from '@storybook/addons';
import { StoryFnReactReturnType } from '@storybook/react/dist/client/preview/types';
import { IGraphProps } from '../src/components/graph/Graph.types';

const meta: Meta = {
  title: 'Graph',
  component: Graph,
};

export default meta;

interface ITemplateArgs extends BaseStory<Args, StoryFnReactReturnType> {
  graphProps: IGraphProps
}

const Template: Story<ITemplateArgs> = (args: ITemplateArgs) => (
  <Graph {...args.graphProps} />
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Basic: Story<ITemplateArgs> = Template.bind({});
Basic.args = {
  graphProps: {
    id: "graph",
    data: {
      nodes: [{ id: "Fluent Graph" }, { id: "React" }, { id: "D3" }],
      links: [
        { source: "Fluent Graph", target: "React" },
        { source: "Fluent Graph", target: "D3" },
      ],
    }
  }
};
