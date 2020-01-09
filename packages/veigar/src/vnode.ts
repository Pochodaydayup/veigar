export type Path = string;

enum TYPE {
  TEXT = 'text',
}

export interface RawNode {
  id?: number;
  type: string;
  props?: any;
  children?: RawNode[];
  text?: string;
}

let queue: Record<string, any>[] = [];

export function setData(data: Record<string, any>, cb?: () => void) {
  const app = getApp();
  const [getCurrentPage] = getCurrentPages().reverse();

  // main.js 里面 mount 的时候实际上 page 还没有
  if (!getCurrentPage) {
    return;
  }

  const context = app.page[getCurrentPage.__route__];

  if (context.__mounted) {
    if (queue.length) {
      context.setData(
        {
          ...queue.reduce((prev, current) => {
            prev = {
              ...prev,
              ...current,
            };
            return prev;
          }, {}),
          ...data,
        },
        cb
      );

      queue = [];
      return;
    }

    context.setData(data, cb);
    return;
  }

  queue.push(data);
}

export default class VNode {
  id: number;
  type: string;
  props?: Record<string, any>;
  text?: string;
  children: VNode[] = [];
  eventListeners?: Record<string, Function | Function[]> | null;
  container?: any;

  parentNode: VNode | null = null;
  nextSibling: VNode | null = null;

  constructor({
    id,
    type,
    props = [],
    text,
    container,
  }: {
    id: number;
    type: string;
    props?: Record<string, any>;
    text?: string;
    container?: any;
  }) {
    this.type = type;
    this.props = props;
    this.text = text;
    this.id = id;
    this.children = [];
    this.container = container;
  }

  appendChild(newNode: VNode) {
    newNode.parentNode = this;

    if (this.children.find(child => child.id === newNode.id)) {
      this.removeChild(newNode);
    }

    this.children.push(newNode);
    console.log(newNode.path(), newNode.toJSON());
    setData({
      [newNode.path()]: newNode.toJSON(),
    });
  }

  insertBefore(newNode: VNode, anchor: VNode) {
    newNode.parentNode = this;
    newNode.nextSibling = anchor;

    if (this.children.find(child => child.id === newNode.id)) {
      this.removeChild(newNode);
    }

    const anchorIndex = this.children.indexOf(anchor);
    this.children.splice(anchorIndex, 0, newNode);

    setData({
      [`${this.path()}.children`]: this.children.map(c => c.toJSON()),
    });
  }

  removeChild(child: VNode) {
    const index = this.children.findIndex(node => node.id === child.id);

    this.children[index - 1].nextSibling = this.children[index + 1];
    this.children.splice(index, 1);

    setData({
      [`${this.path()}.children`]: this.children.map(c => c.toJSON()),
    });
  }

  setText(text: string) {
    this.text = text;

    // TODO 优化 root.text
    setData({
      [`${this.path()}.text`]: text,
    });
  }

  path(): Path {
    if (!this.parentNode) {
      return 'root';
    }
    const path = this.parentNode.path();
    return [
      ...(path === 'root' ? ['root'] : path),
      '.children[',
      this.parentNode.children.indexOf(this) + ']',
    ].join('');
  }

  toJSON(): RawNode {
    if (this.type === TYPE.TEXT) {
      return {
        type: this.type,
        text: this.text,
      };
    }
    return {
      id: this.id,
      type: this.type,
      props: this.props,
      children: this.children && this.children.map(c => c.toJSON()),
      text: this.text,
    };
  }
}
