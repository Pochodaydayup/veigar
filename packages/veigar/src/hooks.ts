/*
 * Created Date: July 8th 2020, 9:06:39 pm
 * Author: zhoupengcheng
 * -----
 * Last Modified: July 8th 2020, 9:06:39 pm
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
}

export const usePageLifeCircle = (lifeCircle: keyof LifeCircle, cb: any) => {
  const page = getContext();

  page[lifeCircle] = cb;
};
