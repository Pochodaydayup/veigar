import VNode from './vnode';
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

  createElement: (tag: string): VNode => {
    return new VNode({
      type: tag,
      id: generate(),
    });
  },

  createText: (text: string): VNode =>
    new VNode({ type: 'rawText', text, id: generate() }),

  createComment: (): VNode =>
    new VNode({ type: 'rawText', text: '', id: generate() }),

  setText: (node: VNode, text: string) => {
    node.appendChild(new VNode({ type: 'rawText', text, id: generate() }));
  },

  setElementText: (el: VNode, text: string) => {
    el.appendChild(new VNode({ type: 'rawText', text, id: generate() }));
  },

  parentNode: (node: VNode): VNode | null => node.parentNode,

  nextSibling: (node: VNode): VNode | null => node.nextSibling,

  querySelector: (): VNode | null => null,

  setScopeId(el: VNode, id: string) {
    if (el.props) {
      const className = el.props.class;
      el.props.class = className ? className + ' ' + id : id;
    }
  },
};
