declare namespace LinkScssNamespace {
  export interface ILinkScss {
    line: string;
    root: string;
  }
}

declare const LinkScssModule: LinkScssNamespace.ILinkScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LinkScssNamespace.ILinkScss;
};

export = LinkScssModule;
