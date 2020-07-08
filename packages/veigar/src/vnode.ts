import { generate } from './nodeId';
import { getContext } from './util';

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

const setData = ({
  node,
  key,
  data,
  cb,
}: {
  node: VNode;
  key: string;
  data: any;
  cb?: () => void;
}) => {
  const context = getContext();
  const setKey = `${node.path()}${key}`;
  console.log('setKey', setKey, data);

  context.setData(
    {
      [setKey]: data,
    },
    cb
  );
};

export function setState({
  node,
  key = '',
  data,
  immediately = false,
  cb,
}: {
  node: VNode;
  key?: string;
  data: any;
  immediately?: boolean;
  cb?: () => void;
}) {
  const context = getContext();

  if (context._mounted) {
    if (immediately) {
      setData({ node, key, data, cb });
      return;
    }

    if (global.Promise) {
      Promise.resolve().then(() => {
        setData({ node, key, data, cb });
      });
    } else {
      setTimeout(() => {
        setData({ node, key, data, cb });
      }, 0);
    }
  }
}

export default class VNode {
  id: number;
  type: string;
  props?: Record<string, any>;
  text?: string;
  children: VNode[] = [];
  eventListeners?: Record<string, Function | Function[]> | null;

  parentNode?: VNode | null;
  nextSibling?: VNode | null;

  constructor({
    id,
    type,
    props = {},
    text,
  }: {
    id: number;
    type: string;
    props?: Record<string, any>;
    text?: string;
  }) {
    this.type = type;
    this.props = props;
    this.text = text;
    this.id = id;
  }

  appendChild(newNode: VNode) {
    if (this.children.find((child) => child.id === newNode.id)) {
      this.removeChild(newNode);
    }

    newNode.parentNode = this;
    this.children.push(newNode);

    setState({ node: newNode, data: newNode.toJSON() });
  }

  insertBefore(newNode: VNode, anchor: VNode) {
    newNode.parentNode = this;
    newNode.nextSibling = anchor;

    if (this.children.find((child) => child.id === newNode.id)) {
      this.removeChild(newNode);
    }

    const anchorIndex = this.children.indexOf(anchor);
    this.children.splice(anchorIndex, 0, newNode);

    setState({
      node: this,
      key: '.children',
      data: this.children.map((c) => c.toJSON()),
    });
  }

  removeChild(child: VNode) {
    const index = this.children.findIndex((node) => node.id === child.id);

    if (index < 0) {
      return;
    }

    if (index === 0) {
      this.children = [];
    } else {
      this.children[index - 1].nextSibling = this.children[index + 1];
      this.children.splice(index, 1);
    }

    setState({
      node: this,
      key: '.children',
      data: this.children.map((c) => c.toJSON()),
    });
  }

  setText(text: string) {
    if (this.type === TYPE.RAWTEXT) {
      this.text = text;
      setState({ node: this, key: '.text', data: text });
      return;
    }

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
    setState({ node: this, key: '.children[0].text', data: text });
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
      children: this.children && this.children.map((c) => c.toJSON()),
      text: this.text,
    };
  }
}
