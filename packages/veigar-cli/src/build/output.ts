import Config from 'webpack-chain';
import path from 'path';

export default function setOutput(config: Config) {
  const cwd = process.cwd();

  config.output
    .path(path.join(cwd, 'dist'))
    .filename('[name].js')
    .publicPath('');
}
