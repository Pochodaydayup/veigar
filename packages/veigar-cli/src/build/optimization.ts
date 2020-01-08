/*
 * Created Date: January 7th 2020, 3:30:18 pm
 * Author: zhoupengcheng
 * -----
 * Last Modified: January 7th 2020, 3:30:18 pm
 */
import Config from 'webpack-chain';
import TerserJSPlugin from 'terser-webpack-plugin';
import OptimizeCSSPlugin from 'optimize-css-assets-webpack-plugin';

export default function setOptimization(config: Config) {
  const prod = process.env.NODE_ENV === 'production';

  config.optimization.runtimeChunk({ name: 'webpack-runtime' });
  config.optimization.splitChunks({
    cacheGroups: {
      commons: {
        name: 'commons',
        chunks: 'initial',
        minChunks: 2,
      },
      vendor: {
        test: /node_modules/,
        name: 'vendor',
        chunks: 'all',
      },
    },
  });

  if (prod) {
    config.optimization
      .minimizer('TerserJSPlugin')
      .use(TerserJSPlugin, [
        {
          parallel: true,
        },
      ])
      .end()
      .minimizer('OptimizeCSSPlugin')
      .use(OptimizeCSSPlugin);
  }
}
