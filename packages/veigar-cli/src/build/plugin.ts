import VueLoaderPlugin from 'vue-loader/dist/plugin';
import Config from 'webpack-chain';
import OptimizeCSSPlugin from 'optimize-css-assets-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import MicroAppPlugin from '../plugin';

export default function setPlugin(config: Config) {
  const prod = process.env.NODE_ENV === 'production';
  // plugin
  config
    .plugin('VueLoaderPlugin')
    .use(VueLoaderPlugin as any)
    .end()
    .plugin('MiniCssExtractPlugin')
    .use(MiniCssExtractPlugin)
    .end()
    .plugin('MicroAppPlugin')
    .use(MicroAppPlugin)
    .end();

  if (prod) {
    config
      .plugin('OptimizeCSSPlugin')
      .use(OptimizeCSSPlugin)
      .end();
  }
}
