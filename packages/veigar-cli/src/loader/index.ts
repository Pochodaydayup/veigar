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
import { getAppConfig } from '../build/entry';

type Components = Map<string, Set<string>>;

const resourceComponents: Map<
  string,
  Record<'components' | 'nativeComponents', Components>
> = new Map();

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

const getProp = (prop: string) => {
  const props = {
    onclick: 'bindtap',
  } as any;
  return props[prop] || prop;
};

export const getComponents = () => {
  type RenderComponents = Record<string, Record<string, string>>;

  const renderComponents: RenderComponents = {};
  const renderCustomComponents: RenderComponents = {};

  const render = (
    components: Components,
    renderComponents: RenderComponents
  ) => {
    for (const [key, component] of components.entries()) {
      for (const prop of component) {
        renderComponents[key] = {
          ...renderComponents[key],
          [getProp(prop)]: `{{item.props['${prop}']}}`,
        };
      }
    }
  };

  for (const { components, nativeComponents } of resourceComponents.values()) {
    render(components, renderComponents);
    render(nativeComponents, renderCustomComponents);
  }

  return {
    components: renderComponents,
    customComponents: renderCustomComponents,
  };
};

export default function mpLoader(this: any, source: string) {
  const { descriptor } = parse(source);

  if (!descriptor.template) {
    return source;
  }
  const { ast } = baseCompile(descriptor.template.content);

  const components: Components = new Map();
  const nativeComponents: Components = new Map();

  const appConfig = getAppConfig();
  const customComponents = appConfig.pages.reduce<string[]>((prev, current) => {
    prev = [...prev, ...Object.keys(current.style.usingComponents || {})];
    return prev;
  }, []);

  const collectComponents = (nodes: TemplateChildNode[]) => {
    for (const child of nodes) {
      if (child.type === NodeTypes.ELEMENT) {
        // native element
        if (customComponents.includes(child.tag)) {
          const props = nativeComponents.get(child.tag);

          if (props) {
            nativeComponents.set(
              child.tag,
              new Set([...props, ...collectProps(child.props)])
            );
          } else {
            nativeComponents.set(child.tag, new Set(collectProps(child.props)));
          }
        }
        // 普通 element, eg: view image...
        if (child.tagType === ElementTypes.ELEMENT) {
          const props = components.get(child.tag);

          if (props) {
            components.set(
              child.tag,
              new Set([...props, ...collectProps(child.props)])
            );
          } else {
            components.set(child.tag, new Set(collectProps(child.props)));
          }
        }

        collectComponents(child.children);
      }
    }
  };

  collectComponents(ast.children);
  resourceComponents.set(this.resourcePath, { components, nativeComponents });

  return source;
}
