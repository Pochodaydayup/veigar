/*
 * Created Date: January 10th 2020, 5:15:49 pm
 * Author: zhoupengcheng
 * -----
 * Last Modified: January 10th 2020, 5:15:49 pm
 */
import path from 'path';
import { getAppConfig } from '../build/entry';

export default function emitPageConfig(assets: any) {
  const { pages, globalStyle } = getAppConfig();
  globalStyle.pages = [];

  for (const { path: pagePath, style } of pages) {
    globalStyle.pages.push(pagePath);

    const pageConfig = JSON.stringify(style, null, 2);
    assets[`${path.join(pagePath)}.json`] = {
      source() {
        return pageConfig;
      },
      size() {
        return pageConfig.length;
      },
    };
  }
}
