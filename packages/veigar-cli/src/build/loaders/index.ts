import Config from 'webpack-chain';
import setScriptLoader from './script';
import setCSSLoader from './css';

export default function setLoader(config: Config) {
  setScriptLoader(config);
  setCSSLoader(config);
}
