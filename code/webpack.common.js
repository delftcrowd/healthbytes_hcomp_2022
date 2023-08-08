const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const Dotenv = require('dotenv-webpack')

const ASSET_PATH = process.env.ASSET_PATH || 'public'

module.exports = {
  entry: "./src/index.tsx",
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    // new webpack.HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: 'public', to: ASSET_PATH }]
    }),
    new Dotenv()
  ]
}