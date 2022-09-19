const path = require('path');
const UserScriptMetaDataPlugin = require("userscript-metadata-webpack-plugin");

let metadata = {
  name: "AWBW Stats",
  namespace: "https://github.com/zielinskigr/awbw_stats/",
  version: "0.2.0",
  author: "zielinskigr",
  source: "https://github.com/zielinskigr/awbw_stats/",
  // 'license': 'MIT',
  match: [
    "https://awbw.amarriner.com/2030.php*",
  ],
  require: [
    `https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js`,
  ],
  'image': 'https://raw.githubusercontent.com/zielinskigr/awbw_stats/main/res/img/stats128.png',
  'description': 'Enchanced Stats Charts for Advance Wars By Web'
}

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'advanced_stats.user.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    // if you need minimize, you need to config minimizer to keep all comments
    // to keep userscript meta.
    minimize: false,
  },
  plugins: [
    new UserScriptMetaDataPlugin({
      metadata,
    }),
  ],
};