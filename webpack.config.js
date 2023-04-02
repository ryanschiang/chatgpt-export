const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    "json": "./src/exportJSON.js",
    "md": "./src/exportMarkdown.js",
    "image": "./src/exportImage.js",
  },
  output: {
    filename: '[name].min.js',
    path: __dirname + '/dist'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: true,
        terserOptions: {
          compress: {
            drop_console: false,
          }
        }
      })
    ]
  }
};
