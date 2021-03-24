import { Meta, Story } from '@storybook/react';
import { FC, useState } from 'react';
import { Node } from '../../src';


const meta: Meta = {
  title: 'Node: Events',
  component: Node,
};

export default meta;

const CountingComponent: FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times.</p>
      <div>
        <svg>
          <g transform="translate(100, 50)">
            <Node
              id="Click the node!"
              label="Click the node!"
              onClickNode={() => {
                setCount(count + 1);
              }}
            />
          </g>
        </svg>
      </div>
    </div>
  )
}

export const Click: Story = () => <CountingComponent />;
