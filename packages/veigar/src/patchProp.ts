// import { patchClass } from './modules/class'
// import { patchStyle } from './modules/style'
// import { patchAttr } from './modules/attrs'
// import { patchDOMProp } from './modules/props'
// import { patchEvent } from './modules/events'
// import { isOn } from '@vue/shared'
// import { ComponentInternalInstance, SuspenseBoundary } from '@vue/runtime-core'

import VNode from './vnode';

export const isOn = (key: string) => key[0] === 'o' && key[1] === 'n';

export function patchProp(
  el: VNode,
  key: string,
  nextValue: any,
  prevValue: any,
) {
  if (nextValue === prevValue) {
    return;
  }

  console.log(el, prevValue, nextValue);

  if (isOn(key)) {
    const [getCurrentPage] = getCurrentPages().reverse();
    const eventName = `$$event_${el.id}`;
    getCurrentPage[eventName] = nextValue;
    el.props![key] = eventName;
  } else {
    el.props![key] = nextValue;
  }
}
