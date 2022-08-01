import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import path from 'path'
import { chromeExtension, simpleReloader } from 'rollup-plugin-chrome-extension'
import { emptyDir } from 'rollup-plugin-empty-dir'
import zip from 'rollup-plugin-zip'

const isProduction = process.env.NODE_ENV === 'production'

const NODE_ENV = isProduction
  ? JSON.stringify('production')
  : JSON.stringify('development')

const apiConfig = {
  input: 'src/api/index.ts',
  output: {
    dir: 'dist/api',
    format: 'esm',
  },
  plugins: [typescript()],
  external: ['node-fetch', '@google-cloud/functions-framework', 'user-agents'],
}

const v2Manifest = {
  input: 'src/v2-manifest.json',
  output: {
    dir: 'dist/v2-manifest',
    format: 'esm',
    chunkFileNames: path.join('chunks', '[name]-[hash].js'),
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': NODE_ENV,
      isV3Manifest: '',
      preventAssignment: true,
    }),
    chromeExtension(),
    simpleReloader(),
    json(),
    resolve(),
    commonjs(),
    typescript(),
    emptyDir(),
    isProduction && zip({ dir: 'releases/v2-manifest' }),
  ],
}

const v3Manifest = {
  input: isProduction
    ? 'src/v3-manifest-prod.json'
    : 'src/v3-manifest-dev.json',
  output: {
    dir: 'dist/manifest',
    format: 'esm',
    chunkFileNames: path.join('chunks', '[name]-[hash].js'),
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': NODE_ENV,
      isV3Manifest: 'true',
      preventAssignment: true,
    }),
    chromeExtension(),
    simpleReloader(),
    json(),
    resolve(),
    commonjs(),
    typescript(),
    emptyDir(),
    isProduction && zip({ dir: 'releases/manifest' }),
  ],
}

const exports = isProduction
  ? [v2Manifest, v3Manifest]
  : [apiConfig, v3Manifest]

export default exports
