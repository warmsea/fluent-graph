import React, { FC, useState } from 'react';
import { Meta } from '@storybook/react';
import { Graph } from '../../src';
import { INodeProps } from '../../src/components/node/Node.types';

const meta: Meta = {
  title: 'Graph: Editing'
};

export default meta;

export const AddingNode: FC = () => {
  const [nodes, setNodes] = useState([{ id: "Root", label: "Root" }]);
  const [links, setLinks] = useState([]);

  const onClickNode = (props: INodeProps) => {
    const newNode = { id: `${Math.random()}`, label: "" };
    setNodes([...nodes, newNode]);
    setLinks([...links, { source: props.id, target: newNode.id }]);
  };

  const onContextMenu = (props: INodeProps, event: React.MouseEvent<SVGElement, MouseEvent>) => {
    event.preventDefault();
    if (props.id === "Root") {
      return;
    }

    setNodes(nodes.filter(node => node.id !== props.id));
    setLinks(links.filter(link => link.source !== props.id && link.target !== props.id));
  };

  return (
    <div>
      <div>
        <p>Click a node to add a new node linked to it.</p>
      </div>
      <div>
      </div>
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
