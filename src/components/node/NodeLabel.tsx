import React from "react";
import { INodeProps } from "./Node.types";

interface NodeLabelProps {
  id: string;
  label?: string;
  style: React.CSSProperties;
  onRenderNodeLabel?: (props: INodeProps) => React.ReactNode;
}

export default function NodeLabel(props: NodeLabelProps) {
  const { label, onRenderNodeLabel } = props;

  return (
    <div style={props.style}>
      {onRenderNodeLabel ? onRenderNodeLabel(props) : <span>{label}</span>}
    </div>
  );
}
