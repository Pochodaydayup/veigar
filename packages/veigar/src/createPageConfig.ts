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
  if (page._lifeCallbacks[key]) {
    let result;
    for (const cb of page._lifeCallbacks[key] as Array<(...args: any) => void>) {
      result = cb.call(page._pageRef.value, data);
    }
    return result;
  }
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
    _lifeCallbacks: {},

    onLoad(this: any, options: any) {
      app._mount(this, page);
      callLifeCircle(this, 'onLoad', options);
    },
    onReady() {
      callLifeCircle(this, 'onReady');
    },
    onShow() {
      callLifeCircle(this, 'onShow');
    },
    onHide() {
      callLifeCircle(this, 'onHide');
    },
    onUnload() {
      callLifeCircle(this, 'onUnload');
      app._unmount();
    },
    onPullDownRefresh(e) {
      callLifeCircle(this, 'onPullDownRefresh', e);
    },
    onReachBottom(e) {
      callLifeCircle(this, 'onReachBottom', e);
    },
    onShareAppMessage(e) {
      callLifeCircle(this, 'onShareAppMessage', e);
    },
    onPageScroll(e) {
      callLifeCircle(this, 'onPageScroll', e);
    },
  };
}
