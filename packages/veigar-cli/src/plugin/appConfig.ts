import { getAppConfig } from '../build/entry';

/*
 * Created Date: January 8th 2020, 6:19:20 pm
 * Author: zhoupengcheng
 * -----
 * Last Modified: January 8th 2020, 6:19:20 pm
 */
// import path from 'path';
// import fs from 'fs-extra';
// import { parse } from '@vue/compiler-sfc';

export default function emitAppConfig(assets: any) {
  const { globalStyle } = getAppConfig();
  const appSource = `require('./common/runtime.js');\nrequire('./common/vendor.js');\nrequire('./common/main.js');\nrequire('./main.js');\n`;

  assets['app.js'] = {
    source() {
      return appSource;
    },
    size() {
      return appSource.length;
    },
  };

  const appCss = '@import "./common/main.ttss"';

  assets['app.ttss'] = {
    source() {
      return appCss;
    },
    size() {
      return appCss.length;
    },
  };

  const appJSON = JSON.stringify(globalStyle, null, 2);

  assets['app.json'] = {
    source() {
      return appJSON;
    },
    size() {
      return appJSON.length;
    },
  };
}
