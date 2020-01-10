import Config = require('webpack-chain');

/*
 * Created Date: January 10th 2020, 5:30:03 pm
 * Author: zhoupengcheng
 * -----
 * Last Modified: January 10th 2020, 5:30:03 pm
 */
export default function setUrlLoader(config: Config) {
  // img
  config.module
    .rule('img-loader')
    .test(/\.(jpeg|jpg|png|gif|bmp|svg)(\?.*)?$/)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options({
      limit: 10,
      name: '[name].[ext]',
      inlineFlag: '__inline',
    })
    .end()
    .end()
    // rule
    .rule('font-loader')
    .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options({
      limit: 10,
      name: '[name].[ext]',
      inlineFlag: '__inline',
    })
    .end();
}
