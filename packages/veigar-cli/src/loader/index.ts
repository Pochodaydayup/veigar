/*
 * Created Date: January 8th 2020, 7:54:10 pm
 * Author: zhoupengcheng
 * -----
 * Last Modified: January 8th 2020, 7:54:10 pm
 */
import { parse } from '@vue/compiler-sfc';
import {
  baseCompile,
  NodeTypes,
  TemplateChildNode,
  AttributeNode,
  DirectiveNode,
  ElementTypes,
} from '@vue/compiler-core';

type Components = Map<string, Set<string>>;

const resourceComponents: Map<string, Components> = new Map();

const collectProps = (props: Array<AttributeNode | DirectiveNode>) => {
  return props.map(prop => {
    if (prop.type === NodeTypes.DIRECTIVE) {
      if (prop.arg?.type === NodeTypes.SIMPLE_EXPRESSION) {
        if (prop.name === 'bind') {
          return prop.arg.content;
        }
        return prop.name + prop.arg.content;
      }
    }

    return prop.name;
  });
};

const collectComponents = (
  components: Components,
  nodes: TemplateChildNode[]
) => {
  for (const child of nodes) {
    // 只有原生组件才收集 props
    if (
      child.type === NodeTypes.ELEMENT &&
      child.tagType === ElementTypes.ELEMENT
    ) {
      const props = components.get(child.tag);

      if (props) {
        components.set(
          child.tag,
          new Set([...props, ...collectProps(child.props)])
        );
      } else {
        components.set(child.tag, new Set(collectProps(child.props)));
      }

      collectComponents(components, child.children);
    }
  }
};

const getProp = (prop: string) => {
  const props = {
    onclick: 'bindtap',
  } as any;
  return props[prop] || prop;
};

export const getComponents = () => {
  const renderComponents: Record<string, Record<string, string>> = {};

  for (const components of resourceComponents.values()) {
    for (const [key, component] of components.entries()) {
      for (const prop of component) {
        renderComponents[key] = {
          ...renderComponents[key],
          [getProp(prop)]: `{{item.props['${prop}']}}`,
        };
      }
    }
  }

  return renderComponents;
};

export default function mpLoader(this: any, source: string) {
  const { descriptor } = parse(source);

  if (!descriptor.template) {
    return source;
  }
  const { ast } = baseCompile(descriptor.template.content);

  const components: Map<string, Set<string>> = new Map();
  collectComponents(components, ast.children);
  resourceComponents.set(this.resourcePath, components);

  return source;
}
