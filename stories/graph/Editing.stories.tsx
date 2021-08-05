import React, { FC, useState } from "react";
import { Meta } from "@storybook/react";
import { Graph } from "../../src";
import { INodeProps } from "../../src/components/node/Node.types";

const meta: Meta = {
  title: "Graph: Editing"
};

export default meta;

export const AddingAndDeleting: FC = () => {
  const [nodes, setNodes] = useState([{ id: "Root", label: "Root" }]);
  const [links, setLinks] = useState([]);

  const onClickNode = (
    props: INodeProps,
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    const nodesCopy = nodes.map(node => {
      if (node.id === props.id) {
        return {
          id: node.id,
          label: node.label,
          force: {
            fx: 0,
            fy: 0
          }
        };
      }
      return {
        id: node.id,
        label: node.label
      };
    });

    const newId = `${Math.random()}`;
    const newNode = {
      id: newId,
      label: newId
    };
    setNodes([...nodesCopy, newNode]);
    setLinks([...links, { source: props.id, target: newNode.id }]);
  };

  const onContextMenu = (
    props: INodeProps,
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (props.id === "Root") {
      return;
    }

    setNodes(nodes.filter(node => node.id !== props.id));
    setLinks(
      links.filter(link => link.source !== props.id && link.target !== props.id)
    );
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
            onContextMenu: onContextMenu
          }}
        />
      </div>
    </div>
  );
};
