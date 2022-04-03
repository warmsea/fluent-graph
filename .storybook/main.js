module.exports = {
  stories: ["../stories/**/*.stories.@(ts|tsx|js|jsx)"],
  typescript: {
    check: true, // type-check stories during Storybook build
  },
  core: {
    builder: "webpack5",
  },
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.s[ac]ss$/i,
      use: [
        "style-loader",
        "@teamsupercell/typings-for-css-modules-loader",
        {
          loader: "css-loader",
          options: { modules: true },
        },
        "sass-loader",
      ],
    });
    return config;
  },
};
