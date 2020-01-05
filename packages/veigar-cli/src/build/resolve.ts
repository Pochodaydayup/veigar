import Config from 'webpack-chain';
import path from 'path';

export default function setResolve(config: Config) {
  const cwd = process.cwd();

  config.resolve.modules
    .add(path.join(cwd, 'node_modules'))
    .add('node_modules')
    .end()
    .extensions.add('.vue')
    .add('.js')
    .add('.ts')
    .add('.jsx')
    .add('.tsx')
    .add('.json')
    .end()
    .alias.set('@', path.join(cwd, 'src'))
    .end();
}
