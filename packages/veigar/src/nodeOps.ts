import VNode, { TYPE } from './vnode';
import { generate } from './nodeId';

export const nodeOps = {
  insert: (child: VNode, parent: VNode, anchor?: VNode) => {
    if (anchor != null) {
      parent.insertBefore(child, anchor);
    } else {
      parent.appendChild(child);
    }
  },

  remove: (child: VNode) => {
    const parent = child.parentNode;
    if (parent != null) {
      parent.removeChild(child);
    }
  },

  createElement: (tag: string): VNode =>
    new VNode({ type: tag, id: generate() }),

  createText: (text: string): VNode =>
    new VNode({ type: TYPE.RAWTEXT, text, id: generate() }),

  createComment: (): VNode => new VNode({ type: TYPE.RAWTEXT, id: generate() }),

  setText: (node: VNode, text: string) => {
    node.setText(text);
  },

  setElementText: (el: VNode, text: string) => {
    el.setText(text);
  },

  parentNode: (node: VNode): VNode | null => node.parentNode ?? null,

  nextSibling: (node: VNode): VNode | null => node.nextSibling ?? null,

  querySelector: (): VNode | null => getApp()._root,

  setScopeId(el: VNode, id: string) {
    if (el.props) {
      const className = el.props.class;
      el.props.class = className ? className + ' ' + id : id;
    }
  },
};
