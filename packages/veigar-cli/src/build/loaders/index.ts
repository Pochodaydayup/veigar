import Config from 'webpack-chain';
import setScriptLoader from './script';
import setCSSLoader from './css';
import setUrlLoader from './file';

export default function setLoader(config: Config) {
  setScriptLoader(config);
  setCSSLoader(config);
  setUrlLoader(config);
}
