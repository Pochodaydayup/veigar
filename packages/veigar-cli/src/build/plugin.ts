import VueLoaderPlugin from 'vue-loader/dist/plugin';
import Config from 'webpack-chain';
import OptimizeCSSPlugin from 'optimize-css-assets-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import VirtualModulesPlugin from 'webpack-virtual-modules';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';

import MicroAppPlugin from '../plugin';
import { getEntry } from './entry';

export default function setPlugin(config: Config) {
  const prod = process.env.NODE_ENV === 'production';

  const entries = getEntry().reduce<Record<string, string>>((current, next) => {
    current[next.filePath] = `import { createPageConfig } from 'vue';
    import App from './index';
    
    Page(createPageConfig(App));`;
    return current;
  }, {});

  // plugin
  config
    .plugin('copy-webpack-plugin')
    .use(CopyWebpackPlugin, [
      [
        {
          from: path.join(process.cwd(), 'project.config.json'),
          to: path.join(process.cwd(), 'dist/project.config.json'),
        },
      ],
    ])
    .end()
    .plugin('VirtualModulesPlugin')
    .use(VirtualModulesPlugin, [entries])
    .end()
    .plugin('VueLoaderPlugin')
    .use(VueLoaderPlugin as any)
    .end()
    .plugin('MiniCssExtractPlugin')
    .use(MiniCssExtractPlugin, [
      {
        filename: '[name].ttss',
      },
    ])
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
