const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  optimization: {
    // if you need minimize, you need to config minimizer to keep all comments
    // to keep userscript meta.
    minimize: false,
  },
  output: {
    filename: 'advanced_stats.js',
    path: path.resolve(__dirname, 'dist'),
  },
};