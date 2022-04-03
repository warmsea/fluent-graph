import React, { FC, useState } from "react";
import { Meta } from "@storybook/react";
import { Graph } from "../../src";
import { INodeProps } from "../../src/components/node/Node.types";
import { IGraphPropsLink, IGraphPropsNode } from "../../src/components/graph/Graph.types";

const meta: Meta = {
  title: "Demos/Updating",
};

export default meta;

export const AddingAndDeleting: FC = () => {
  const [nodes, setNodes] = useState<IGraphPropsNode[]>([{ id: "Root", label: "Root" }]);
  const [links, setLinks] = useState<IGraphPropsLink[]>([]);

  const onClickNode = (nodeProps: INodeProps) => {
    const nodesCopy = nodes.map((node) => {
      if (node.id === nodeProps.id) {
        return {
          id: node.id,
          label: node.label,
          force: {
            fx: 0,
            fy: 0,
          },
        };
      }
      return {
        id: node.id,
        label: node.label,
      };
    });

    const newId = `${Math.random()}`;
    const newNode = {
      id: newId,
      label: newId,
    };
    setNodes([...nodesCopy, newNode]);
    setLinks([...links, { source: nodeProps.id, target: newNode.id }]);
  };

  const onContextMenu = (nodeProps: INodeProps, event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    if (nodeProps.id === "Root") {
      return;
    }

    setNodes(nodes.filter((node) => node.id !== nodeProps.id));
    setLinks(links.filter((link) => link.source !== nodeProps.id && link.target !== nodeProps.id));
  };

  return (
    <div>
      <div>
        <p>Click a node to add a new node linked to it.</p>
        <p>Right click a node to delete it, except for the Root node.</p>
      </div>
      <div></div>
      <div>
        <Graph
          id="adding"
          nodes={nodes}
          links={links}
          nodeConfig={{
            onClickNode: onClickNode,
            onContextMenu: onContextMenu,
          }}
        />
      </div>
    </div>
  );
};
