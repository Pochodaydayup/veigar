import ts from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

export default {
  input: 'src/index.ts',
  output: {
    file: './examples/mp/runtime/veigar.dev.js',
    format: 'esm',
  },
  plugins: [
    resolve(),
    replace({
      'process.env.NODE_ENV': process.env.NODE_ENV,
    }),
    ts(),
  ],
};
