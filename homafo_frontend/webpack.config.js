var webpack = require("webpack");
var path = require("path");

console.log("BUILD DIR", path.resolve(__dirname, "dist"));
module.exports = {
  performance: {
    maxAssetSize: 400000,
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  entry: {
    homafo: "./src/index.tsx",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    //path: path.resolve(__dirname,'../../'),
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
            plugins: ["@babel/plugin-proposal-class-properties"],
          },
        },
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: { noEmit: false },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(css|sass|scss)$/,

        //include: /react/,
        // exclude: /node_modules/,
        loaders: [
          require.resolve("style-loader"),
          require.resolve("css-loader"),
          require.resolve("sass-loader"),
        ],
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
        loader: "url-loader?limit=30000&name=[name]-[hash].[ext]",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".css"],
  },
  //---------uncomment for fixing  any developer  webpack issue ------
  //   "exclude": [
  //     "./plugins/**/*",
  //     "./typings/**/*",
  //     "./built/**/*" //
  // ]
  //-----------------------------------////
};
