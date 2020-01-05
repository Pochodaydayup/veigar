import Config from 'webpack-chain';
import setEntry from './entry';
import setOutput from './output';
import setResolve from './resolve';

type Target = 'toutiao';

export default function build(target: Target, watch: boolean) {
  const config = new Config();

  config.mode(watch ? 'development' : 'production');

  setEntry(config);

  setOutput(config);

  setResolve(config);

  config.devtool(watch ? 'cheap-eval-source-map' : 'nosources-source-map');
}
