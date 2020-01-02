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
  prevValue: any
) {
  if (nextValue === prevValue) {
    return;
  }

  el.props![key] = nextValue;
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    (el.eventListeners || (el.eventListeners = {}))[event] = nextValue;
  }

  el.container.setData({
    [el.path()]: el,
  });
}
