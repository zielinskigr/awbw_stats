const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'advanced_stats.js',
    path: path.resolve(__dirname, 'dist'),
  },
};