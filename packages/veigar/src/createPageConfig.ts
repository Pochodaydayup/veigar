import { LifeCircle } from './hooks';
import {
  ComponentOptions,
  Ref,
  ComponentPublicInstance,
  ref,
} from '@vue/runtime-core';

export type PageOptions = LifeCircle & {
  _pageRef: Ref<ComponentPublicInstance | null>;
  data: any;
  _mounted: boolean;
};

const callLifeCircle = (
  page: ComponentOptions & PageOptions,
  key: keyof Omit<LifeCircle, 'data' | '_mounted'>,
  data?: any
) => {
  page[key] && (page[key] as any).call(page._pageRef.value, data);
};

export default function createPageConfig(
  this: any,
  page: PageOptions
): PageOptions {
  const app = getApp();

  return {
    data: {
      root: null,
    },
    _mounted: false,
    _pageRef: ref(null),

    onLoad(this: any, options: any) {
      this.element = page;
      app._mount(this);
      callLifeCircle(page, 'onLoad', options);
    },
    onReady() {
      callLifeCircle(page, 'onReady');
    },
    onShow() {
      callLifeCircle(page, 'onShow');
    },
    onHide() {
      callLifeCircle(page, 'onHide');
    },
    onUnload() {
      callLifeCircle(page, 'onUnload');
      app._unmount(this);
    },
    onPullDownRefresh(e) {
      callLifeCircle(page, 'onPullDownRefresh', e);
    },
    onReachBottom(e) {
      callLifeCircle(page, 'onReachBottom', e);
    },
    onShareAppMessage(e) {
      callLifeCircle(page, 'onShareAppMessage', e);
    },
    onPageScroll(e) {
      callLifeCircle(page, 'onPageScroll', e);
    },
  };
}
