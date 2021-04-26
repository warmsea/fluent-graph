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
    const parentX = event.clientX ?? 0;
    const parentY = event.clientY ?? 0;
    const angle: number = Math.random() * Math.PI * 2;
    const newX: number = Math.cos(angle) * 100 + parentX;
    const newY: number = Math.sin(angle) * 100 + parentY;
    const newNode = {
      id: `${Math.random()}`,
      label: "",
      force: { x: newX, y: newY }
    };
    setNodes([...nodes, newNode]);
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
