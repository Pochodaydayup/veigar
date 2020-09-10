/*
 * Created Date: July 8th 2020, 9:06:39 pm
 * Author: zhoupengcheng
 * -----
 * Last Modified: December 31st 2019, 6:51:47 pm
 */

import { getContext } from './util';

export interface LifeCircle {
  onLoad: (options: any) => void;
  onReady: () => void;
  onShow: () => void;
  onHide: () => void;
  onUnload: () => void;
  onPullDownRefresh: (e: any) => void;
  onReachBottom: (e: any) => void;
  onShareAppMessage: (e: any) => void;
  onPageScroll: (e: any) => void;
  _lifeCallbacks: Partial<Record<keyof LifeCircle, Array<(...args: any) => void>>>;
}

export const usePageLifeCircle = (lifeCircle: keyof LifeCircle, cb: any) => {
  const page = getContext();

  const cbs = page._lifeCallbacks[lifeCircle] || [];

  page._lifeCallbacks[lifeCircle] = [...cbs, cb];
};
