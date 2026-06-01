import path from 'path'

import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

import { chromeExtension, simpleReloader } from 'rollup-plugin-chrome-extension'
import { emptyDir } from 'rollup-plugin-empty-dir'
import zip from 'rollup-plugin-zip'
import replace from '@rollup/plugin-replace'

const isProduction = process.env.NODE_ENV === 'production'

const firefoxManifestCompat = {
  name: 'firefox-manifest-compat',
  generateBundle(_, bundle) {
    const asset = bundle['manifest.json']
    if (!asset) return
    const manifest = JSON.parse(asset.source)
    if (manifest.background?.service_worker) {
      manifest.background.scripts = [manifest.background.service_worker]
      asset.source = JSON.stringify(manifest, null, 2)
    }
  }
}

export default {
  input: 'src/manifest.json',
  output: {
    dir: 'dist',
    format: 'esm',
    chunkFileNames: path.join('chunks', '[name]-[hash].js')
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': isProduction
        ? JSON.stringify('production')
        : JSON.stringify('development'),
      preventAssignment: true
    }),
    chromeExtension(),
    // Adds a Chrome extension reloader during watch mode
    // TODO: Service worker gives error
    simpleReloader(),
    firefoxManifestCompat,
    resolve(),
    commonjs(),
    typescript(),
    // Empties the output dir before a new build
    emptyDir(),
    // Outputs a zip file in ./releases
    isProduction && zip({ file: 'build.zip' })
  ]
}
