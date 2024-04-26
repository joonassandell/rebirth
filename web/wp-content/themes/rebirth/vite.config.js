import { basename, resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import { writeFileSync } from 'fs';
import FullReload from 'vite-plugin-full-reload';
import jsconfigPaths from 'vite-jsconfig-paths';

const themeDir = basename(__dirname);

export default ({ mode }) => {
  const development = mode === 'development';
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const { VITE_HOST, VITE_DEVELOPMENT_HOST, PREVIEW } = process.env;

  return defineConfig({
    plugins: [
      FullReload('**/*.{php,twig}'),
      jsconfigPaths({
        root: '../',
      }),
      {
        name: 'postbuild-command',
        closeBundle: () => {
          if (PREVIEW) {
            writeFileSync(resolve(__dirname, 'dist/PREVIEW'), '');
          }
        },
      },
    ],
    root: 'assets',
    base: development ? '/' : `/wp-content/themes/${themeDir}/dist/`,
    build: {
      assetsDir: '',
      emptyOutDir: true,
      manifest: true,
      outDir: resolve(__dirname, 'dist'),
      rollupOptions: {
        input: [
          resolve(__dirname, 'assets/head.js'),
          resolve(__dirname, 'assets/index.build.js'),
        ],
        output: {
          chunkFileNames: 'chunk-[hash].js',
        },
      },
    },
    esbuild: {
      legalComments: 'none',
    },
    server: {
      cors: true,
      port: VITE_HOST && VITE_HOST.split(':').pop(),
      strictPort: true,
      host: true,
      origin: `${VITE_DEVELOPMENT_HOST}/wp-content/themes/${themeDir}/assets`,
    },
  });
};
