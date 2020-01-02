import ts from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: {
    file: './examples/mp/runtime/veigar.dev.js',
    format: 'esm',
  },
  plugins: [resolve(), ts()],
};
