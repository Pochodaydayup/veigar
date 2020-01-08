import Config from 'webpack-chain';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

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
          javascriptEnabled: true,
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
      .loader('postcss-loader')
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
    .end();

  setPrecessorLoader(config);
}
