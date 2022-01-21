const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry: {
    main: "./src/client/js/main.js",
    sideMenu: "./src/client/js/sideMenu.js",
    editDaily: "./src/client/js/editDaily.js",
    editWeekly: "./src/client/js/editWeekly.js",
    editMonthly: "./src/client/js/editMonthly.js",
    editMonthly: "./src/client/js/editYearly.js",
    newDaily: "./src/client/js/newDaily.js",
    newWeekly: "./src/client/js/newWeekly.js",
    newMonthly: "./src/client/js/newMonthly.js",
    newYearly: "./src/client/js/newYearly.js",
    previousDaily: "./src/client/js/previousDaily.js",
    previousWeekly: "./src/client/js/previousWeekly.js",
    previousMonthly: "./src/client/js/previousMonthly.js",
    previousYearly: "./src/client/js/previousYearly.js",
    today: "./src/client/js/today.js",
    thisWeek: "./src/client/js/thisWeek.js",
    thisMonth: "./src/client/js/thisMonth.js",
    thisYear: "./src/client/js/thisYear.js",
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
