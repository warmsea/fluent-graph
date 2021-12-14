import React from "react";
import { Meta, Story } from "@storybook/react";
import { Graph } from "../../src";
import { Args, BaseStory } from "@storybook/addons";
import { StoryFnReactReturnType } from "@storybook/react/dist/client/preview/types";
import { IGraphProps } from "../../src/components/graph/Graph.types";

const meta: Meta = {
  title: "Graph"
};

export default meta;

interface ITemplateArgs extends BaseStory<Args, StoryFnReactReturnType> {
  graphProps: IGraphProps;
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
    nodes: [
      { id: "Fluent Graph" },
      { id: "React" },
      { id: "D3" },
      { id: "D4" },
      { id: "D5" },
      { id: "D6" },
      { id: "D7" },
      { id: "D8" },
      { id: "D9" },
      { id: "D10" },
      { id: "D11" },
      { id: "D12" },
      { id: "D13" },
      { id: "D14" },
      { id: "D15" }
    ],
    links: [
      { source: "Fluent Graph", target: "React" },
      { source: "Fluent Graph", target: "D3" },
      { source: "Fluent Graph", target: "D4" },
      { source: "Fluent Graph", target: "D5" },
      { source: "Fluent Graph", target: "D6" },
      { source: "Fluent Graph", target: "D7" },
      { source: "Fluent Graph", target: "D8" },
      { source: "React", target: "D15" },
      { source: "D3", target: "D14" },
      { source: "D4", target: "D13" },
      { source: "D5", target: "D12" },
      { source: "D6", target: "D11" },
      { source: "D7", target: "D10" },
      { source: "D8", target: "D9" }
    ],
    config: {
      sim: {
        gravity: -150,
        linkLength: 120,
        linkStrength: 2,
        paddingRadius: 30
      }
    }
  }
};

export const Styled: Story<ITemplateArgs> = Template.bind({});
Styled.args = {
  graphProps: {
    id: "graph",
    nodes: [{ id: "Fluent Graph" }, { id: "React" }, { id: "D3" }],
    links: [
      { source: "Fluent Graph", target: "React" },
      { source: "Fluent Graph", target: "D3" }
    ],
    nodeConfig: {
      nodeStyle: {
        fill: "skyblue"
      },
      labelStyle: {
        fill: "darkgray",
        fontSize: 12
      }
    },
    linkConfig: {
      lineStyle: {
        borderColor: "deepskyblue"
      }
    }
  }
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
      { source: "B2", target: "C" }
    ]
  }
};

export const Complex: Story<ITemplateArgs> = Template.bind({});
Complex.args = {
  graphProps: {
    id: "graph",
    nodes: [
      { id: "Mark 8" },
      { id: "Aerial" },
      { id: "GIS Mapping" },
      { id: "Survey Intelligence" },
      { id: "Flight Operations" },
      { id: "Structual Integrity" },
      { id: "Spaces" },
      { id: "Digital Surfaces" },
      { id: "3D Modeling" },
      { id: "Partners" },
      { id: "Geothermal" },
      { id: "United" },
      { id: "Delta" },
      { id: "Swiftly" },
      { id: "Data Visualization" },
      { id: "Fjord" },
      { id: "Altas" },
      { id: "Construction Operations" },
      { id: "Athena" },
      { id: "Elements" },
      { id: "Juno" },
      { id: "Milk" },
      { id: "Coffee" },
      { id: "Tea" },
      { id: "Juice" },
      { id: "Orange Juice" },
      { id: "Black Tea" },
      { id: "Espresso" },
      { id: "Espresso1" },
      { id: "Espresso2" }
    ],
    links: [
      { source: "Mark 8", target: "Aerial" },
      { source: "Mark 8", target: "GIS Mapping" },
      { source: "Mark 8", target: "Survey Intelligence" },
      { source: "Mark 8", target: "Flight Operations" },
      { source: "Mark 8", target: "Coffee" },
      { source: "Mark 8", target: "Tea" },
      { source: "Mark 8", target: "Juice" },
      { source: "Aerial", target: "Structual Integrity" },
      { source: "Aerial", target: "Spaces" },
      { source: "GIS Mapping", target: "Digital Surfaces" },
      { source: "GIS Mapping", target: "3D Modeling" },
      { source: "Survey Intelligence", target: "Partners" },
      { source: "Survey Intelligence", target: "Geothermal" },
      { source: "Flight Operations", target: "United" },
      { source: "Flight Operations", target: "Delta" },
      { source: "Structual Integrity", target: "Swiftly" },
      { source: "Structual Integrity", target: "Data Visualization" },
      { source: "Spaces", target: "Data Visualization" },
      { source: "Spaces", target: "Fjord" },
      { source: "Juice", target: "Orange Juice" },
      { source: "Tea", target: "Black Tea" },
      { source: "Coffee", target: "Espresso" },
      { source: "Espresso", target: "Espresso1" },
      { source: "Espresso", target: "Espresso2" },
      { source: "Spaces", target: "Altas" },
      { source: "Spaces", target: "Construction Operations" },
      { source: "Partners", target: "Athena" },
      { source: "United", target: "Elements" },
      { source: "Delta", target: "Juno" },
      { source: "Juno", target: "Milk" }
    ],
    nodeConfig: {
      nodeFocusable: true
    },
    linkConfig: {
      onClickLink: (ev, linkProps) => console.log("Clicked on link", linkProps),
      customAttributes: { className: "link-test", tabIndex: 0 }
    },
    config: {
      sim: {
        gravity: -150,
        linkLength: 120,
        linkStrength: 2,
        paddingRadius: 30
      }
    }
  }
};
