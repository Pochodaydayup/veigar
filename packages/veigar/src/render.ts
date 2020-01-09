import {
  createRenderer,
  // warn,
  // RootRenderFunction,
} from '@vue/runtime-core';
import { nodeOps } from './nodeOps';
import { patchProp } from './patchProp';
import VNode from './vnode';
import createAppConfig from './createAppConfig';
import { generate } from './nodeId';
// Importing from the compiler, will be tree-shaken in prod
// import { isFunction, isString, isHTMLTag, isSVGTag } from '@vue/shared'

export const { render, createApp: baseCreateApp } = createRenderer<
  VNode,
  VNode
>({
  patchProp,
  ...nodeOps,
});

export const createApp = () => {
  const App = baseCreateApp();

  const mount = App.mount;

  App.mount = (
    app,
    root = new VNode({
      type: 'root',
      id: generate(),
    })
  ) => {
    createAppConfig(app);

    return mount(app, root);
  };

  return App;
};

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
