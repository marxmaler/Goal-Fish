const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry: {
    main: "./src/client/js/main.js",
    sideMenu: "./src/client/js/sideMenu.js",
    editDaily: "./src/client/js/editDaily.js",
    editWeekly: "./src/client/js/editWeekly.js",
    today: "./src/client/js/today.js",
    newDaily: "./src/client/js/newDaily.js",
    newWeekly: "./src/client/js/newWeekly.js",
    previousDaily: "./src/client/js/previousDaily.js",
    thisWeek: "./src/client/js/thisWeek.js",
    sharedDaily: "./src/client/js/sharedDaily.js",
    sharedWeekly: "./src/client/js/sharedWeekly.js",
    sharedAll: "./src/client/js/sharedAll.js",
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
