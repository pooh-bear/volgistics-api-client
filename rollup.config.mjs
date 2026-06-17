import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/bundle.cjs',
      format: 'cjs',
    },
    {
      file: 'dist/bundle.esm.js',
      format: 'es',
    }
  ],
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
    resolve(),
    commonjs(),
  ],
};
