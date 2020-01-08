/*
 * Created Date: January 7th 2020, 5:34:02 pm
 * Author: zhoupengcheng
 * -----
 * Last Modified: January 7th 2020, 5:34:02 pm
 */
import { Compiler } from 'webpack';
import path from 'path';
import { getEntry } from '../build/entry';
import emitAppConfig from './appConfig';

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

      const appSource = `require('./common/runtime.js');
      require('./common/vendor.js');
      ${
        compilation.assets['common/main.js']
          ? "require('./common/main.js');"
          : ''
      }
      `;

      compilation.assets['app.js'] = {
        source() {
          return appSource;
        },
        size() {
          return appSource.length;
        },
      };

      const ttml = '<view>dddd</view>';

      getEntry().forEach(page => {
        compilation.assets[`${page.page}.ttml`] = {
          source() {
            return ttml;
          },
          size() {
            return ttml.length;
          },
        };
      });

      emitAppConfig(compilation.assets);

      callback();
    });
  }
}
