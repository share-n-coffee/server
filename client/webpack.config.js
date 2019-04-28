const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js',
    publicPath: 'dist/'
  },

  watch: true,

  watchOptions: {
    aggregateTimeout: 100
  },

  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    compress: true,
    port: 5000
  }
};
