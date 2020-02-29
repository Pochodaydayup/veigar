import { Component } from '@vue/runtime-core';

export default function createPageConfig(this: any, page: Component) {
  const app = getApp();
  const root = app._root;

  return {
    data: {
      root: root.toJSON(),
    },
    _mounted: false,
    onLoad(this: any) {
      this.element = page;
      app._mount(this);
    },
    onReady() {},
    onShow() {},
    onHide() {},
    onUnload() {
      app._unmount(this);
    },
    onPullDownRefresh() {},
    onReachBottom() {},
    onShareAppMessage() {},
    onPageScroll() {},
  };
}
