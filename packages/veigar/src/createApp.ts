import {
  CreateAppFunction,
  h,
  defineComponent,
  onMounted,
  ComponentOptions,
} from '@vue/runtime-core';
import VNode, { setState } from './vnode';
import { render } from './render';
import { getContext } from './util';

type ReturnParams<T> = T extends (...args: infer U) => any ? U : T;

export type AppType = ReturnParams<CreateAppFunction<VNode>>[0];

const PageWrapper = (component: ComponentOptions, root: VNode) =>
  defineComponent({
    setup() {
      const context = getContext();
      context._mounted = false;

      onMounted(() => {
        context._mounted = true;
        setState({
          node: root,
          data: root.toJSON(),
        });
      });
      return () => h(component);
    },
  });

export default function createAppConfig(app: AppType, container: VNode) {
  App({
    ...app,
    _root: container,
    _pages: [] as any[],
    _mount(page: any) {
      this._pages.push(page);
      this._render();
    },
    _unmount() {
      this._pages.pop();
      this._render();
    },
    _render() {
      const pageLength = this._pages.length;
      const Page = PageWrapper(this._pages[pageLength - 1].element, this._root);

      render(h(Page), this._root);
    },
  });
}
