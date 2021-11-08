import React, { FC } from "react";
import { Meta, Story } from "@storybook/react";
import { Args, BaseStory } from "@storybook/addons";
import { StoryFnReactReturnType } from "@storybook/react/dist/client/preview/types";
import { Link, Node } from "../../src";
import { ILinkProps } from "../../src/components/link/Link.types";

const meta: Meta = {
  title: "Link: Styling"
};

export default meta;

interface ITemplateArgs extends BaseStory<Args, StoryFnReactReturnType> {
  linkProps: ILinkProps;
}

const Template: Story<ITemplateArgs> = (args: ITemplateArgs) => (
  <div>
    <Link {...args.linkProps} />
  </div>
);

const DEFAULT_REQUIRED_PROPS: ILinkProps = {
  id: "Fluent Graph Link",
  start: { x: 50, y: 50 },
  end: { x: 200, y: 100 }
};

export const Basic: Story<ITemplateArgs> = Template.bind({});
Basic.args = {
  linkProps: {
    ...DEFAULT_REQUIRED_PROPS
  }
};

export const Styled: Story<ITemplateArgs> = Template.bind({});
Styled.args = {
  linkProps: {
    ...DEFAULT_REQUIRED_PROPS,
    size: 8,
    color: "skyblue",
    lineType: "dashed"
  }
};

export const ClickableLink: Story<ITemplateArgs> = Template.bind({});
ClickableLink.args = {
  linkProps: {
    ...DEFAULT_REQUIRED_PROPS,
    size: 4,
    onClickLink: (ev, linkProps) => console.log("clicking on link: ", linkProps)
  }
};

export const Offset: FC = () => (
  <div style={{ position: "absolute" }}>
    <Node
      id="start"
      label="offset: -10"
      style={{
        position: "absolute",
        left: 50,
        top: 50
      }}
    />
    <Node
      id="end"
      label="offset: 20"
      style={{
        position: "absolute",
        left: 200,
        top: 100
      }}
    />
    <Link
      id="Link with offset"
      style={{ zIndex: 10 }}
      color={"red"}
      start={{ x: 50, y: 50, offset: -10 }}
      end={{ x: 200, y: 100, offset: 20 }}
    />
  </div>
);
