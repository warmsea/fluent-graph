import React, { FC, MutableRefObject, useRef } from "react";
import { Meta } from "@storybook/react";
import { Graph } from "../../src";
import { IGraphBehavior } from "../../src/components/graph/Graph.types";

const meta: Meta = {
  title: "Demos/Behavior",
};

export default meta;

export const Zoom: FC = () => {
  const graphRef: MutableRefObject<IGraphBehavior> = useRef();
  return (
    <div>
      <button onClick={() => graphRef.current?.zoomBy(Math.SQRT2)}>Zoom in</button>
      <button onClick={() => graphRef.current?.zoomBy(Math.SQRT1_2)}>Zoom out</button>
      <button onClick={() => graphRef.current?.resetZoom()}>Reset zoom</button>
      <Graph
        id="graph"
        config={{
          width: 400,
          height: 300,
          zoom: {
            zoomByDoubleClick: false,
          },
        }}
        nodes={[{ id: "Fluent Graph" }, { id: "React" }, { id: "D3" }]}
        links={[
          { source: "Fluent Graph", target: "React" },
          { source: "Fluent Graph", target: "D3" },
        ]}
        behaviorRef={graphRef}
      />
    </div>
  );
};
