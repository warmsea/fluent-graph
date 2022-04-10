declare namespace NodeScssNamespace {
  export interface INodeScss {
    label: string;
    node: string;
    root: string;
  }
}

declare const NodeScssModule: NodeScssNamespace.INodeScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NodeScssNamespace.INodeScss;
};

export = NodeScssModule;
