const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry: {
    main: "./src/client/js/main.js",
    sideMenu: "./src/client/js/sideMenu.js",
    editGoal: "./src/client/js/editGoal.js",
    newGoal: "./src/client/js/newGoal.js",
    previousGoal: "./src/client/js/previousGoal.js",
    currentGoal: "./src/client/js/currentGoal.js",
    sharedDaily: "./src/client/js/sharedDaily.js",
    sharedWeekly: "./src/client/js/sharedWeekly.js",
    sharedMonthly: "./src/client/js/sharedMonthly.js",
    sharedYearly: "./src/client/js/sharedYearly.js",
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
