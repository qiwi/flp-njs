import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { getBabelOutputPlugin } from '@rollup/plugin-babel';

export default {
  input: 'src/main/njs/flp.js',
  output: {
    dir: 'target/nginx',
    format: 'es',
    exports: 'default'
  },
  plugins: [
    nodeResolve({
      dedupe: ['date-fns', 'is-mobile', 'nanoid', 'platform']
    }),
    commonjs(),
    getBabelOutputPlugin({
      presets: ['@babel/preset-env']
    })
  ]
};
