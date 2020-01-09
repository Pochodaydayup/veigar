import {
  Component,
  resolveComponent,
  createBlock,
  openBlock,
} from '@vue/runtime-core';
import { baseCreateApp as createApp } from './render';
import { generate } from './nodeId';
import VNode from './vnode';

export default function createPageConfig(this: any, page: Component) {
  const root = new VNode({
    type: 'root',
    id: generate(),
  });

  return {
    data: {
      root: root.toJSON(),
    },
    onLoad() {
      const app = getApp();
      app.page = {};

      const route = (this as any).__route__;
      app.page[route] = this;

      createApp().mount(
        {
          components: {
            page,
          },
          mounted() {
            console.log('dsadasdsadsa');
            app.page[route].__mounted = true;
          },
          render() {
            const page = resolveComponent('page');
            console.log(page);
            return openBlock(), createBlock(page!);
          },
        },
        root
      );
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
