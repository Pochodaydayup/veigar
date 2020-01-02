import {
  createRenderer,
  // warn,
  // App,
  // RootRenderFunction
} from '@vue/runtime-core';
import { nodeOps } from './nodeOps';
import { patchProp } from './patchProp';
import VNode from './vnode';
// Importing from the compiler, will be tree-shaken in prod
// import { isFunction, isString, isHTMLTag, isSVGTag } from '@vue/shared'

export const { render, createApp } = createRenderer<VNode, VNode>({
  patchProp,
  ...nodeOps,
});

// // DOM-only runtime directive helpers
// export {
//   vModelText,
//   vModelCheckbox,
//   vModelRadio,
//   vModelSelect,
//   vModelDynamic
// } from './directives/vModel'
// export { withModifiers, withKeys } from './directives/vOn'
// export { vShow } from './directives/vShow'

// // DOM-only components
// export { Transition, TransitionProps } from './components/Transition'
// export {
//   TransitionGroup,
//   TransitionGroupProps
// } from './components/TransitionGroup'

// re-export everything from core
// h, Component, reactivity API, nextTick, flags & types
// export * from '@vue/runtime-core'
