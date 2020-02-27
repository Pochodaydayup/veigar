import { generate } from './nodeId';

export enum TYPE {
  RAWTEXT = 'rawText',
  TEXT = 'text',
}

export interface RawNode {
  id?: number;
  type: string;
  props?: any;
  children?: RawNode[];
  text?: string;
}

export function setData(data: Record<string, any>, cb?: () => void) {
  const app = getApp();
  const [getCurrentPage] = getCurrentPages().reverse();

  // main.js 里面 mount 的时候实际上 page 还没有
  if (!getCurrentPage) {
    return;
  }

  const context = app.page[getCurrentPage.__route__];

  if (context.__mounted) {
    console.log(data, cb);
    context.setData(data, cb);
  }
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
    props = {},
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

    if (index === 0) {
      this.children = [];
    } else {
      this.children[index - 1].nextSibling = this.children[index + 1];
      this.children.splice(index, 1);
    }

    setData({
      [`${this.path()}.children`]: this.children.map(c => c.toJSON()),
    });
  }

  setText(text: string) {
    if (this.type === TYPE.TEXT) {
      if (!this.children.length) {
        this.appendChild(
          new VNode({
            type: TYPE.RAWTEXT,
            id: generate(),
            text,
          })
        );
        return;
      }

      this.children[0].text = text;
      setData({
        [`${this.path()}.children[0].text`]: text,
      });
    } else if (this.type === TYPE.RAWTEXT) {
      this.text = text;
      setData({
        [`${this.path()}.text`]: text,
      });
    }
  }

  path(): string {
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
    if (this.type === TYPE.RAWTEXT) {
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
