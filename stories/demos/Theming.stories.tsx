import { Meta, Story } from "@storybook/react";
import React from "react";
import { createUseStyles, ThemeProvider, useTheme } from "react-jss";
import { Graph, IGraphProps } from "../../src";

const meta: Meta = {
  title: "Demo/Theming",
};

export default meta;

interface GraphTheme {
  graphBackground: string;
  graphBorder: string;
  nodeColor: string;
  nodeLabelColor: string;
  lineColor: string;
}

const THEMES: Record<string, GraphTheme> = {
  light: {
    graphBackground: "#FFFFFF",
    graphBorder: "#F5871F",
    nodeColor: "#8959A8",
    nodeLabelColor: "#4271AE",
    lineColor: "#4D4D4C",
  },
  dark: {
    graphBackground: "#1D1F21",
    graphBorder: "#DE935F",
    nodeColor: "#B294BB",
    nodeLabelColor: "#81A2BE",
    lineColor: "#C5C8C6",
  },
};

const useThemedStyles = createUseStyles((theme: GraphTheme) => ({
  graph: {
    backgroundColor: theme.graphBackground,
    border: `solid 2px ${theme.graphBorder}`,
    borderRadius: 20,
  },
  node: {
    backgroundColor: theme.nodeColor,
  },
  nodeLabel: {
    color: theme.nodeLabelColor,
  },
}));

const ThemedGraph: React.FC<{ theme?: GraphTheme }> = (props) => {
  const theme: GraphTheme = useTheme();
  const styles = useThemedStyles(props);
  const graphProps: IGraphProps = {
    id: "graph",
    nodes: [{ id: "Fluent Graph" }, { id: "React" }, { id: "D3" }],
    links: [
      { source: "Fluent Graph", target: "React" },
      { source: "Fluent Graph", target: "D3" },
    ],
    className: styles.graph,
    nodeConfig: {
      nodeClassName: styles.node,
      labelClassName: styles.nodeLabel,
    },
    linkConfig: {
      color: theme.lineColor,
    },
  };
  return <Graph {...graphProps} />;
};

export const Theming: Story = (args) => {
  const theme = args.theme == "dark" ? THEMES.dark : THEMES.light;
  return (
    <ThemeProvider theme={theme}>
      <ThemedGraph />
    </ThemeProvider>
  );
};
Theming.argTypes = {
  theme: {
    name: "Theme",
    control: {
      type: "inline-radio",
      options: ["light", "dark"],
    },
    defaultValue: "light",
  },
};
