import { App } from '@vue/runtime-core';
import VNode from './vnode';

type ReturnParams<T> = T extends (...args: infer U) => any ? U : T;

/*
 * Created Date: January 8th 2020, 8:38:37 pm
 * Author: zhoupengcheng
 * -----
 * Last Modified: December 31st 2019, 6:51:47 pm
 */
export default function createAppConfig(
  app: ReturnParams<App<VNode>['mount']>[0]
) {
  App({
    ...app,
  });
}
