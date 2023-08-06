// rollup.config.js
import gltf from 'rollup-plugin-gltf';

export default {
  entry: 'src/index.js',
  dest: 'dist/js/bundle.js',
  plugins: [
    gltf({
      include: ['**/*.gltf', '**/*.bin'],
      exclude: 'artwork/*.gltf',
      inlineAssetLimit: 250 * 1024, // 250kb
      inline: false,
    }),
  ],
};