const path = require("path");
const MiniExtractCSS = require("mini-css-extract-plugin");

const autoprefixer = require("autoprefixer");

const MODE = process.env.WEBPACK_ENV;
const ENTRY_FILE = path.resolve(__dirname, "assets", "js", "main.js");
const OUTPUT_DIR = path.resolve(__dirname, "static");

const config = {
  entry: ["@babel/polyfill", ENTRY_FILE],
  mode: MODE,
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniExtractCSS.loader,
            options: {
              // hmr: process.env.WEBPACK_ENV === "development",
            },
          },
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              // plugins() {
              //   return [
              //     autoprefixer({
              //       overrideBrowserslist: "cover 99.5%",
              //     }),
              //   ];
              // },
            },
          },

          "sass-loader",
        ],
      },
      {
        test: /\.css$/i,
        use: [MiniExtractCSS.loader, 'css-loader'],
      },
    ],
  },
  output: {
    path: OUTPUT_DIR,
    filename: "[name].js",
  },
  plugins: [
    new MiniExtractCSS({
      // filename: '[name].css',
      // chunkFilename: '[id].css',
      filename: "styles.css",
    }),
  ],
};

module.exports = config;



// const path = require("path");
// const autoprefixer = require("autoprefixer");
// const ExtractCSS = require("extract-text-webpack-plugin");

// const MODE = process.env.WEBPACK_ENV;
// const ENTRY_FILE = path.resolve(__dirname, "assets", "js", "main.js");
// const OUTPUT_DIR = path.join(__dirname, "static");

// const config = {
//   entry: ["@babel/polyfill", ENTRY_FILE],
//   mode: MODE,
//   module: {
//     rules: [
//       {
//         test: /\.(js)$/,
//         use: [
//           {
//             loader: "babel-loader",
//           },
//         ],
//       },
//       {
//         test: /\.(scss)$/,
//         use: ExtractCSS.extract([
//           {
//             loader: "css-loader",
//           },
//           {
//             loader: "postcss-loader",
//             options: {
//               postcssOptions: {
//                 plugins() {
//                   return [autoprefixer({ browsers: "cover 99.5%" })];
//                 },
//               },
//             },
//           },
//           {
//             loader: "sass-loader",
//           },
//         ]),
//       },
//     ],
//   },
//   output: {
//     path: OUTPUT_DIR,
//     filename: "[name].js",
//   },
//   plugins: [new ExtractCSS("styles.css")],
// };

// module.exports = config;