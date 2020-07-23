import {
  createRenderer,
  CreateAppFunction,
  // warn,
} from '@vue/runtime-core';
import { nodeOps } from './nodeOps';
import { patchProp } from './patchProp';
import VNode from './vnode';
import createAppConfig from './createApp';
import { generate } from './nodeId';

export const { render, createApp: baseCreateApp } = createRenderer<
  VNode,
  VNode
>({
  patchProp,
  ...nodeOps,
});

export const createApp: CreateAppFunction<VNode> = (app) => {
  const mainApp = baseCreateApp(app);

  const mount = mainApp.mount;

  mainApp.mount = () => {
    const container = new VNode({
      type: 'root',
      id: generate(),
    });
    createAppConfig(app, container);

    return mount(container);
  };

  return mainApp;
};
