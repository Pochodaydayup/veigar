import {
  Component,
  resolveComponent,
  createBlock,
  openBlock,
} from '@vue/runtime-core';
import { baseCreateApp as createApp } from './render';
import { setData } from './vnode';

export default function createPageConfig(this: any, page: Component) {
  const app = getApp();
  const root = app.$root;

  return {
    data: {
      root: root.toJSON(),
    },
    onLoad() {
      const route = (this as any).__route__;
      app.$page[route] = this;

      createApp({
        components: {
          page,
        },
        mounted() {
          console.log('page mounted');
          app.$page[route].__mounted = true;
          setData({
            root: root.toJSON(),
          });
        },
        render() {
          const page = resolveComponent('page');
          return openBlock(), createBlock(page!);
        },
      }).mount(root);
    },
    onReady() {},
    onShow() {},
    onHide() {},
    onUnload() {},
    onPullDownRefresh() {},
    onReachBottom() {},
    onShareAppMessage() {},
    onPageScroll() {},
  };
}
