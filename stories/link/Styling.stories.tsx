import React, { SVGAttributes } from 'react';
import { Meta, Story } from '@storybook/react';
import { Link } from '../../src/components/link/Link';
import { Args, BaseStory } from '@storybook/addons';
import { StoryFnReactReturnType } from '@storybook/react/dist/client/preview/types';
import * as d3 from 'd3';
import { ILinkProps } from '../../src/components/link/Link.types';

const meta: Meta = {
  title: 'Link: Styling',
  component: Link,
};

export default meta;

interface ITemplateArgs extends BaseStory<Args, StoryFnReactReturnType> {
  linkProps: ILinkProps
}

const Template: Story<ITemplateArgs> = (args: ITemplateArgs) => (
  <div>
    <svg width={400} height={300}>
      <Link {...args.linkProps} />
    </svg>
  </div>
);

const DEFAULT_REQUIRED_PROPS: ILinkProps = {
  id: "Fluent Graph Link",
  label: "Fluent Graph Link",
  start: { x: 50, y: 50 },
  end: { x: 200, y: 100 }
}

export const Basic: Story<ITemplateArgs> = Template.bind({});
Basic.args = {
  linkProps: {
    ...DEFAULT_REQUIRED_PROPS,
  }
};

export const Styled: Story<ITemplateArgs> = Template.bind({});
Styled.args = {
  linkProps: {
    ...DEFAULT_REQUIRED_PROPS,
    lineStyle: {
      stroke: "skyblue",
      strokeWidth: 3,
    },
    labelStyle: {
      fill: "gray"
    }
  }
};
