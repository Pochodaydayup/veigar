import * as Vue from '../../runtime/veigar.dev';
const _Vue = Vue;

const vue = {
  data: {
    a: 1,
  },
  mounted() {
    setTimeout(() => {
      this.a = 1231321312;
    }, 1000);
    console.log('child mounted');
  },
  render() {
    const {
      toString: _toString,
      createVNode: _createVNode,
      createTextVNode: _createTextVNode,
      createBlock: _createBlock,
      openBlock: _openBlock,
    } = _Vue;

    return (
      _openBlock(),
      _createBlock('div', null, [
        _createTextVNode(_toString(this.a), 1 /* TEXT */),
        _createVNode('p', null, 'dddddd'),
      ])
    );
  },
};

Page(Vue.createPageConfig(vue));
