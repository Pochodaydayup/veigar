/*
 * Created Date: January 7th 2020, 5:34:02 pm
 * Author: zhoupengcheng
 * -----
 * Last Modified: January 7th 2020, 5:34:02 pm
 */
import { Compiler } from 'webpack';
import path from 'path';
import emitAppConfig from './appConfig';
import emitTemplate from './template';

export default class MicroAppPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.emit.tapAsync('MicroAppPlugin', (compilation, callback) => {
      const cwd = process.cwd();
      const configPath = path.join(cwd, 'src/app.config.js');
      const { pages, globalStyle } = require(configPath);
      globalStyle.pages = [];

      for (const { path: pagePath, style } of pages) {
        globalStyle.pages.push(pagePath);

        const pageConfig = JSON.stringify(style);
        compilation.assets[`${path.join(pagePath)}.json`] = {
          source() {
            return pageConfig;
          },
          size() {
            return pageConfig.length;
          },
        };
      }

      const source = JSON.stringify(globalStyle, null, 2);

      compilation.assets['app.json'] = {
        source() {
          return source;
        },
        size() {
          return source.length;
        },
      };

      emitAppConfig(compilation.assets);

      emitTemplate(compilation.assets);

      callback();
    });
  }
}
