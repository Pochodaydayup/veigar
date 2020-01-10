/*
 * Created Date: January 7th 2020, 5:34:02 pm
 * Author: zhoupengcheng
 * -----
 * Last Modified: January 7th 2020, 5:34:02 pm
 */
import { Compiler } from 'webpack';
import emitAppConfig from './appConfig';
import emitTemplate from './template';
import emitPageConfig from './pageConfig';

export default class MicroAppPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.emit.tapAsync('MicroAppPlugin', (compilation, callback) => {
      emitAppConfig(compilation.assets);

      emitPageConfig(compilation.assets);

      emitTemplate(compilation.assets);

      callback();
    });
  }
}
