import Config from 'webpack-chain';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import px2units from 'postcss-px2units';

const px2unitOptions = {
  divisor: 1,
  multiple: 2,
  decimalPlaces: 2,
  comment: 'no',
  targetUnits: 'rpx',
};

function setPrecessorLoader(config: Config) {
  const css: Record<
    string,
    { reg: RegExp; loader: { name: string; options?: any } }
  > = {
    less: {
      reg: /\.less$/,
      loader: {
        name: 'less-loader',
        options: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
    'sass/scss': {
      reg: /\.scss$/,
      loader: {
        name: 'sass-loader',
      },
    },
    stylus: {
      reg: /\.styl$/,
      loader: {
        name: 'stylus-loader',
        options: {
          sourceMap: true,
        },
      },
    },
  };

  for (const [key, loader] of Object.entries(css)) {
    config.module
      .rule(key)
      .test(loader.reg)
      .use('extract')
      .loader(MiniCssExtractPlugin.loader)
      .end()
      .use('css-loader')
      .loader('css-loader')
      .end()
      .use('postcss-loader')
      .loader(require.resolve('postcss-loader'))
      .options({
        plugins: [px2units(px2unitOptions)],
      })
      .end()
      .use(loader.loader.name)
      .loader(loader.loader.name)
      .options(loader.loader?.options)
      .end();
  }
}

export default function setCssLoader(config: Config) {
  config.module
    .rule('css')
    .test(/\.css$/)
    .use('extract')
    .loader(MiniCssExtractPlugin.loader)
    .end()
    .use('css-loader')
    .loader(require.resolve('css-loader'))
    .options({
      importLoaders: 1,
    })
    .end()
    .use('postcss-loader')
    .loader(require.resolve('postcss-loader'))
    .options({
      plugins: [px2units(px2unitOptions)],
    })
    .end();

  setPrecessorLoader(config);
}
