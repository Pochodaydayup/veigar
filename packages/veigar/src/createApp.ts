import { PageOptions } from './createPageConfig';
import {
  CreateAppFunction,
  h,
  defineComponent,
  onMounted,
  ref,
  ComponentOptions,
  Fragment,
} from '@vue/runtime-core';
import VNode, { setState, TYPE } from './vnode';
import { render } from './render';
import { getContext } from './util';

type ReturnParams<T> = T extends (...args: infer U) => any ? U : T;

export type AppType = ReturnParams<CreateAppFunction<VNode>>[0];

const withPage = (
  component: PageOptions & ComponentOptions,
  root: any,
  index: number
) =>
  defineComponent(() => {
    const context = getContext();
    context._mounted = false;

    const pageRef = ref(null);
    component._pageRef = pageRef;

    onMounted(() => {
      context._mounted = true;
      const children = root.children.filter(
        (child: VNode) => child.type !== TYPE.RAWTEXT
      )[index];

      setState({
        node: children,
        data: children.toJSON(),
      });
    });
    return () => h(component, { ref: pageRef });
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
    _mount(pageInstance: any, pageOptions: PageOptions) {
      this._pages.push(pageInstance);

      pageInstance.element = h(
        withPage(pageOptions, this._root, this._pages.length - 1)
      );

      this._render();
    },
    _unmount() {
      this._pages.pop();
      this._render();
    },
    _render() {
      render(
        h(
          Fragment,
          this._pages.map((page: any) => page.element)
        ),
        this._root
      );
    },
  });
}
