import { CreateAppFunction } from '@vue/runtime-core';
import VNode from './vnode';

type ReturnParams<T> = T extends (...args: infer U) => any ? U : T;

/*
 * Created Date: January 8th 2020, 8:38:37 pm
 * Author: zhoupengcheng
 * -----
 * Last Modified: January 8th 2020, 8:38:37 pm
 */
export default function createAppConfig(
  app: ReturnParams<CreateAppFunction<VNode>>[0]
) {
  App(app);
}
