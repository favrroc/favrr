/* eslint-disable @typescript-eslint/no-var-requires */
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const package = require("./package.json");
const path = require("path");
require("dotenv").config();

module.exports = (env, argv) => {
  const production = argv.mode == "production";

  return {
    entry: "./src/index.tsx",
    output: {
      path: __dirname + "/build",
      filename: "static/bundle[fullhash].js",
      publicPath: "/",
    },
    devServer: {
      port: 3000,
      historyApiFallback: {
        index: "/",
      },
      publicPath: "",
      index: "static/index.html",
      https: {
        key: "./webpack/cert/localhost-key.pem",
        cert: "./webpack/cert/localhost.pem"
      },
    },
    mode: production ? "production" : "development",
    module: {
      rules: [
        {
          test: /\.s?css$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "sass-loader",
              options: {
                implementation: require("sass")
              }
            }
          ],
        },
        {
          enforce: "pre",
          test: /\.tsx?/,
          loader: "eslint-loader",
          exclude: [/node_modules/, /generated-graphql/, /generated-subgraph/],
          options: {
            failOnWarning: false,
          },
        },
        {
          test: /\.tsx?/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
        {
          test: /\.svg$/i,
          use: [
            "@svgr/webpack",
            {
              loader: "file-loader",
              options: {
                name: "[contenthash]_2.[ext]",
                publicpath: "/",
                outputPath: "static/images",
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|ico)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                useRelativePath: false,
                publicpath: "/",
                outputPath: "static/images",
              },
            },
            {
              loader: "image-webpack-loader",
              options: {
                bypassOnDebug: true, // webpack@1.x
                disable: true, // webpack@2.x and newer
              },
            }
          ],
        }
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "assets", "template", "index.html"),
        filename: "static/index.html",
      }),
      new FaviconsWebpackPlugin(path.resolve(__dirname, "src", "assets", "template", "logo.png")),
      new MiniCssExtractPlugin({ filename: "static/bundle[fullhash].css", ignoreOrder: true }),
      //   new CopyPlugin([{ from: 'translation/content', to: 'static/content' }]),
      // new AssetsPlugin({ filename: "./build/assets.json" }),
      new webpack.EnvironmentPlugin([
        "STAGE",
      ]),
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(package.version),
      }),
      new NodePolyfillPlugin(),
      new CopyPlugin({
        patterns: [
          path.resolve(__dirname, "src", "assets", "template", "manifest.json"),
          path.resolve(__dirname, "src", "assets", "template", "logo.png"),
        ],
      }),
    ],
    devtool: production ? "cheap-module-source-map" : "eval-source-map",
    resolve: {
      extensions: [".tsx", ".ts", ".json", ".js", ".mjs"],
      fallback: {
        http: require.resolve("stream-http"),
      },
    },
  };
};
