module.exports = function (api) {
  const presets = [
    ["@babel/preset-env"],
    "@babel/preset-typescript",
    "@babel/preset-react",
  ];

  return {
    presets,
    plugins: [
      [
        "formatjs",
        {
          idInterpolationPattern: "[sha512:contenthash:base64:6]",
          ast: true,
          removeDefaultMessage: api.env("production") ? true : false,
        },
      ],
      [
        "babel-plugin-styled-components",
        {
          ssr: true,
        },
      ],
    ],
  };
};
