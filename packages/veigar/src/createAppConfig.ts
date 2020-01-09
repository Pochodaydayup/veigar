import { Component } from '@vue/runtime-core';

/*
 * Created Date: January 8th 2020, 8:38:37 pm
 * Author: zhoupengcheng
 * -----
 * Last Modified: January 8th 2020, 8:38:37 pm
 */
export default function createAppConfig(app: Component) {
  App({
    ...app,
  });
}
