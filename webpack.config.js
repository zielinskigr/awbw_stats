const path = require('path');
const UserScriptMetaDataPlugin = require("userscript-metadata-webpack-plugin");
/*!
 * // ==UserScript==
 *     // @name         AWBW Stats
 *     // @namespace    https://github.com/zielinskigr/awbw_stats/
 *     // @version      0.1.0
 *     // @description  Enchanced Stats Charts for Advance Wars By Web
 *     // @author       zielinskigr
 *     // @match        https://awbw.amarriner.com/2030.php*
 *     // @icon         https://raw.githubusercontent.com/zielinskigr/awbw_stats/main/res/img/stats128.png
 *     // @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js
 *     // ==/UserScript==
 */

let metadata = {
  name: "AWBW Stats",
  namespace: "https://github.com/zielinskigr/awbw_stats/",
  version: "0.1.0",
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
    filename: 'advanced_stats.js',
    path: path.resolve(__dirname, 'dist'),
  },
};