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
        stroke: "deepskyblue"
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

export const ManyConnections: Story<ITemplateArgs> = Template.bind({});
ManyConnections.args = {
  graphProps: {
    id: "graph",
    config: {
      width: 600,
      height: 400
    },
    nodes: [
      {
        id: "Mark 8",
        size: 32,
        nodeStyle: {
          backgroundColor: "#04787c"
        },
        force: {
          fx: 0,
          fy: 0
        }
      },
      {
        id: "Structural Integrity",
        size: 20,
        nodeStyle: { backgroundColor: "#c239b3" }
      },
      {
        id: "Flight Operations",
        size: 14,
        nodeStyle: { backgroundColor: "#c239b3" }
      },
      {
        id: "3D Modeling",
        size: 16,
        nodeStyle: { backgroundColor: "white", border: "solid 2px #5c2d91" }
      },
      {
        id: "GIS Mapping",
        size: 14,
        nodeStyle: { backgroundColor: "#5c2d91" }
      },
      { id: "Geothermal", size: 20, nodeStyle: { backgroundColor: "#5c2d91" } },
      { id: "Aerial", size: 20, nodeStyle: { backgroundColor: "#5c2d91" } },
      {
        id: "Atlas",
        size: 22,
        nodeStyle: { backgroundColor: "white", border: "solid 2px #ca500f" }
      },
      {
        id: "Elements",
        size: 14,
        nodeStyle: { backgroundColor: "white", border: "solid 2px #ca500f" }
      },
      {
        id: "SOAR",
        label: "Sustainable Operations Agricultural Reliability",
        size: 22,
        nodeStyle: { backgroundColor: "white", border: "solid 2px #ca500f" }
      },
      { id: "Delta", size: 32, nodeStyle: { backgroundColor: "#ca500f" } },
      { id: "Swiftly", size: 32, nodeStyle: { backgroundColor: "#ca500f" } },
      {
        id: "Fjord",
        size: 22,
        nodeStyle: { backgroundColor: "white", border: "solid 2px #4f6bed" }
      },
      {
        id: "Juno",
        size: 14,
        nodeStyle: { backgroundColor: "white", border: "solid 2px #4f6bed" }
      },
      {
        id: "Data Visualization",
        size: 22,
        nodeStyle: { backgroundColor: "white", border: "solid 2px #4f6bed" }
      },
      {
        id: "Digital Surfaces",
        size: 20,
        nodeStyle: { backgroundColor: "#4f6bed" }
      },
      {
        id: "Survey Intelligence",
        size: 20,
        nodeStyle: { backgroundColor: "#4f6bed" }
      },
      {
        id: "COR",
        label: "Construction Operations Reliability",
        size: 34,
        nodeStyle: { backgroundColor: "white", border: "solid 2px #498204" }
      },
      {
        id: "Spaces",
        size: 34,
        nodeStyle: { backgroundColor: "white", border: "solid 2px #498204" }
      },
      { id: "Partners", size: 32, nodeStyle: { backgroundColor: "#498204" } }
    ],
    links: [
      {
        source: "Mark 8",
        target: "Structural Integrity",
        size: 5,
        lineType: "dashed"
      },
      { source: "Mark 8", target: "Flight Operations", size: 5 },
      { source: "Mark 8", target: "3D Modeling", size: 4, lineType: "dashed" },
      { source: "Mark 8", target: "GIS Mapping", size: 4, lineType: "dashed" },
      { source: "Mark 8", target: "Geothermal", size: 4 },
      { source: "Mark 8", target: "Aerial", size: 4, lineType: "dashed" },
      { source: "Mark 8", target: "Atlas", size: 3, lineType: "dashed" },
      {
        source: "Flight Operations",
        target: "Atlas",
        size: 2,
        lineType: "dashed"
      },
      { source: "Mark 8", target: "Elements", size: 3, lineType: "dashed" },
      { source: "Mark 8", target: "SOAR", size: 3, lineType: "dashed" },
      { source: "3D Modeling", target: "SOAR", size: 1, lineType: "dashed" },
      { source: "GIS Mapping", target: "SOAR", size: 1, lineType: "dashed" },
      { source: "Mark 8", target: "Delta", size: 3, lineType: "dashed" },
      { source: "Mark 8", target: "Swiftly", size: 3 },
      { source: "Aerial", target: "Swiftly", size: 2 },
      { source: "Mark 8", target: "Fjord", size: 2, lineType: "dashed" },
      { source: "Atlas", target: "Fjord", size: 1, lineType: "dashed" },
      {
        source: "Mark 8",
        target: "Data Visualization",
        size: 2,
        lineType: "dashed"
      },
      { source: "Mark 8", target: "Juno", size: 2 },
      { source: "Delta", target: "Juno", size: 1 },
      { source: "Mark 8", target: "Digital Surfaces", size: 2 },
      { source: "Swiftly", target: "Digital Surfaces", size: 2 },
      { source: "Mark 8", target: "Survey Intelligence", size: 3 },
      { source: "Mark 8", target: "COR", size: 1, lineType: "dashed" },
      { source: "Atlas", target: "COR", size: 1, lineType: "dashed" },
      {
        source: "Survey Intelligence",
        target: "COR",
        size: 1,
        lineType: "dashed"
      },
      { source: "Mark 8", target: "Spaces", size: 1, lineType: "dashed" },
      { source: "Elements", target: "Spaces", size: 1, lineType: "dashed" },
      {
        source: "Data Visualization",
        target: "Spaces",
        size: 1,
        lineType: "dashed"
      },
      { source: "Mark 8", target: "Partners", size: 1 },
      { source: "Geothermal", target: "Partners", size: 1 },
      { source: "Swiftly", target: "Partners", size: 1 }
    ],
    nodeConfig: {
      nodeStyle: {
        boxShadow: "0 2px 4px grey"
      }
    },
    linkConfig: {
      lineStyle: {
        borderBottomColor: "rgb(4, 120, 124, .5)"
      }
    }
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
      focusable: true
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
