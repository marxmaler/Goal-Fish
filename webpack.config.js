const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry: {
    main: "./src/client/js/main.js",
    sideMenu: "./src/client/js/sideMenu.js",
    editDaily: "./src/client/js/editDaily.js",
    editWeekly: "./src/client/js/editWeekly.js",
    home: "./src/client/js/home.js",
    newDaily: "./src/client/js/newDaily.js",
    newWeekly: "./src/client/js/newWeekly.js",
    previousDaily: "./src/client/js/previousDaily.js",
  },
  mode: "development",
  watch: true,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
