import Config from 'webpack-chain';
import { baseCompile as compile, baseParse as parse } from '@vue/compiler-core';
import path from 'path';
import { resolve } from '../../util';

export default function setScriptLoader(config: Config) {
  const isDev = process.env.NODE_ENV === 'development';

  config.module
    .rule('vue')
    .test(/\.vue$/)
    .include.add(resolve('src'))
    .end()
    .use('vue-loader')
    .loader(require.resolve('vue-loader'))
    .options({
      compiler: {
        compile,
        parse,
      },
      hotReload: isDev,
    })
    .end()
    .use('mp-loader')
    .loader(path.join(__dirname, '../../loader/index.js'))
    .end();

  config.module
    .rule('js')
    .test(/\.(js|ts|jsx|tsx)$/)
    .include.add(resolve('src'))
    .end()
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options({
      presets: [
        require.resolve('babel-preset-vca-jsx'),
        [
          require.resolve('@vue/babel-preset-app'),
          {
            useBuiltIns: 'entry',
            targets: {
              browsers: ['Android >=4.4.0', 'iOS >=8.0'],
            },
          },
        ],
        require.resolve('@babel/preset-typescript'),
      ],
    })
    .end();
}
