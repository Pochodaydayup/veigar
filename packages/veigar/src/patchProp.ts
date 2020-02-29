// import { patchClass } from './modules/class'
// import { patchStyle } from './modules/style'
// import { patchAttr } from './modules/attrs'
// import { patchDOMProp } from './modules/props'
// import { patchEvent } from './modules/events'
// import { isOn } from '@vue/shared'
// import { ComponentInternalInstance, SuspenseBoundary } from '@vue/runtime-core'

import VNode, { setState } from './vnode';
import { getContext } from './util';

export const isOn = (key: string) => key[0] === 'o' && key[1] === 'n';

const props = {
  onClick: 'bindtap',
  onInput: 'bindinput',
} as any;

export function patchProp(
  el: VNode,
  key: string,
  nextValue: any,
  prevValue: any
) {
  if (nextValue === prevValue) {
    return;
  }

  if (isOn(key)) {
    const page = getContext();
    const eventName = `$$event_${el.id}`;
    page[eventName] = nextValue;

    if (props[key]) {
      el.props![props[key]] = eventName;
      return;
    }

    el.props![key] = eventName;
    return;
  }

  el.props![key] = nextValue;

  setState({
    node: el,
    key: `.props.${key}`,
    data: nextValue,
  });
}
