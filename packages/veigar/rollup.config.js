import ts from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';

export default {
  input: 'src/index.ts',
  output: {
    file: './examples/mp/runtime/veigar.dev.js',
    format: 'esm',
  },
  plugins: [
    alias({
      entries: {
        '@vue/runtime-core': '../../vue-next/packages/runtime-core/index.js',
      },
    }),
    resolve(),
    ts(),
  ],
};
