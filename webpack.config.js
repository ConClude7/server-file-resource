const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.ts",
  output: {
    filename: "build.js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devtool: process.env.NODE_ENV === "production" ? false : "inline-source-map",
  devServer: {
    // webpack4配置devServer中用的是contentBase:“”;
    // webpack5需要替换成 static:“”
    // contentBase:"./dist" //指定（额外的）静态文件目录， // 如果使用 CopyWebpackPlugin ，设置为false
    static: "./dist",

    compress: false,
    host: "localhost",
    port: 8080,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
  ],
};
