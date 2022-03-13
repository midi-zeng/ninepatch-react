import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import sass from 'rollup-plugin-sass';
import postcss from 'rollup-plugin-postcss';
import url from 'rollup-plugin-url';
import { eslint } from 'rollup-plugin-eslint';
import stylelint from 'rollup-plugin-stylelint';
import typescript from 'rollup-plugin-typescript2';

/* postCSS plugins */
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';

import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    external(),
    eslint({
      throwOnError: true,
      throwOnWarning: true
    }),
    stylelint({
      throwOnError: true,
      throwOnWarning: true
    }),
    postcss({
      plugins: [simplevars(), nested()],
      modules: true
    }),
    sass({ insert: false }),
    url(),
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs({
      namedExports: {
        // https://github.com/rollup/rollup-plugin-commonjs#custom-named-exports
        'node_modules/react/index.js': ['useState', 'useRef', 'useEffect']
      }
    }),
    typescript()
  ],
  external: ['prop-types', 'uuid', 'react', 'react-dom']
};
