import Config from 'webpack-chain';
import webpack from 'webpack';
import setEntry from './entry';
import setOutput from './output';
import setResolve from './resolve';
import setLoader from './loaders';
import setOptimization from './optimization';
import { error } from '../util/logger';
import setPlugin from './plugin';

type Target = 'toutiao';

function setWebpackConfig(watch: boolean) {
  const config = new Config();

  config.mode(watch ? 'development' : 'production');

  setEntry(config);

  setOutput(config);

  setResolve(config);

  setLoader(config);

  setPlugin(config);

  setOptimization(config);

  config.devtool(watch ? 'cheap-module-source-map' : 'source-map');

  config.target('web');

  return config.toConfig();
}

const outputStats = (err: Error, stats: webpack.Stats) => {
  if (err) {
    error(err.stack || err);
    return;
  }

  console.log(
    stats.toString({
      colors: true,
      modules: false,
      assets: false,
      children: false,
      entrypoints: false,
    })
  );
};

export default function build(target: Target, watch: boolean) {
  const config = setWebpackConfig(watch);
  console.log(config.module?.rules);

  const compiler = webpack(config);

  if (watch) {
    compiler.watch(
      {
        ignored: /node_modules/,
      },
      (err, stats) => {
        outputStats(err, stats);
      }
    );
    return;
  }

  compiler.run((err, stats) => {
    outputStats(err, stats);
  });
}
