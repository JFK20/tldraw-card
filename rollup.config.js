import ts from 'rollup-plugin-ts';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  plugins: [
    nodeResolve(),
    json(),
    postcss(),
    ts({
      browserslist: false
    }),
    terser({
      output: {
        comments: false
      }
    })
  ],
  input: 'src/tldraw-card.ts',
  output: {
    dir: 'dist',
  },
};