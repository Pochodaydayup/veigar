import { PageOptions } from './createPageConfig';
import {
  CreateAppFunction,
  h,
  defineComponent,
  onMounted,
  ref,
  ComponentOptions,
} from '@vue/runtime-core';
import VNode, { setState } from './vnode';
import { render } from './render';
import { getContext } from './util';

type ReturnParams<T> = T extends (...args: infer U) => any ? U : T;

export type AppType = ReturnParams<CreateAppFunction<VNode>>[0];

const PageWrapper = (component: PageOptions & ComponentOptions, root: VNode) =>
  defineComponent({
    setup() {
      const context = getContext();
      context._mounted = false;

      const pageRef = ref(null);
      component._pageRef = pageRef;

      onMounted(() => {
        context._mounted = true;
        setState({
          node: root,
          data: root.toJSON(),
        });
      });
      return () => h(component, { ref: pageRef });
    },
  });

export default function createAppConfig(app: AppType, container: VNode) {
  App({
    ...app,
    // vue root vnode 节点
    _root: container,
    // pages 页面
    _pages: [] as any[],
    getContext() {
      const pageLength = this._pages.length;
      return this._pages[pageLength - 1];
    },
    _mount(page: any) {
      this._pages.push(page);
      this._render();
    },
    _unmount() {
      this._pages.pop();
      this._render();
    },
    _render() {
      const Page = PageWrapper(this.getContext().element, this._root);

      render(h(Page), this._root);
    },
  });
}
