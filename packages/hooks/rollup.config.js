import fs from 'fs';
import path from 'path';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const Index = 'src/index.ts';
const HooksDir = 'src/hooks';

// 入口文件
const input = {
  index: Index,
};

fs.readdirSync(path.resolve(HooksDir)).map((fileName) => {
  if (fileName === 'utils') return;
  input[`hooks/${fileName}/index`] = `${HooksDir}/${fileName}/index.ts`;
});

// 打包文件
const output = {
  dir: 'dist',
  format: 'es',
};

// babel配置
const babelOptions = {
  presets: ['@babel/preset-env'],
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss'],
  exclude: '**/node_modules/**',
};

const external = ['react', /node_modules/];

export default {
  input,
  output,
  external,
  plugins: [babel(babelOptions), typescript(), terser()],
};
