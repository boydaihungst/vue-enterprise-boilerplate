/* eslint-env node */
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import UnheadVite from '@unhead/addons/vite';
import LegacyPlugin from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { loadEnv, type BuildOptions } from 'vite';
import { compression } from 'vite-plugin-compression2';
import tsconfigPaths from 'vite-tsconfig-paths';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import * as zlib from 'zlib';

// https://vitejs.dev/config/

/**
 * Build optimized for production
 */
const buildProd: BuildOptions = {
  rollupOptions: {
    // exclude mock server worker
    external: [
      fileURLToPath(new URL('public/mockServiceWorker.js', import.meta.url)),
      fileURLToPath(new URL('tests/mock-api/*', import.meta.url)),
    ],
    plugins: [
      // TsconfigPathsPlugin({}),
      UnheadVite(),
      compression({
        algorithm: 'gzip',
        exclude: [/\.(br)$/, /\.(gz)$/],
        include: [/\.js$|\.css$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/],
        deleteOriginalAssets: false,
        threshold: 0,
      }),
      compression({
        algorithm: 'brotliCompress',
        exclude: [/\.(br)$/, /\.(gz)$/],
        include: [/\.js$|\.css$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/],
        deleteOriginalAssets: false,
        threshold: 0,
        compressionOptions: {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          },
        },
      }),
    ],
  },
};

/**
 * Strip data-test from vue template
 */
function removeAttrFromTemplate(node: any, attrName: string) {
  if (node.type === 1 /* NodeTypes.ELEMENT */) {
    node.props = node.props.filter((prop: any) =>
      prop.type === 6 /* NodeTypes.ATTRIBUTE */ ? prop.name !== attrName : true,
    );
  }
}
export default defineConfig(({ mode }) => {
  // Default vite won't load env in config vite config file
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  const isProd = mode === 'production';
  const isTest = mode === 'test';
  const pathMap: Record<string, string> = {
    // '@tests': './tests',
    // '@src': './src',
    // '@router': './src/router',
    // '@views': './src/router/views',
    // '@layouts': './src/router/layouts',
    // '@components': './src/components',
    // '@assets': './src/assets',
    // '@utils': './src/utils',
    // '@stores': './src/stores',
    // Every @import inside style tag need to be defined here. Until [issue-1052536338](https://github.com/aleclarson/vite-tsconfig-paths/issues/41#issue-1052536338) is solved
    '@design': './src/design/index.scss',
    // // custom
    // '@plugin': './src/plugin',
    // '@models': './src/models',
    // '@composables': './src/composables',
  };
  const resolveAlias: Record<string, any> = {};

  for (const alias in pathMap) {
    const aliasTo = pathMap[alias];

    resolveAlias[alias] = path.resolve(__dirname, aliasTo);
    // fileURLToPath(new URL(aliasTo, import.meta.url));
  }
  return {
    // single page app mode
    appType: 'spa',
    // server when run vite dev
    server: {
      /**
       * We use msw's web service worker to mock server response locally
       * {@link https://mswjs.io/docs/}
       */
      host: 'localhost',
      // set to true to automatically open in browser on startup
      open: false,
      port: 8081,
      /** {@link https://github.com/chimurai/http-proxy-middleware} */
      proxy: {
        '/api': {
          // real api url to test or run app, only forward request to mock server if this env variable is not existed
          target: process.env.VITE_API_BASE_URL,
          secure: false,
          ws: true,
          changeOrigin: true,
        },
      },
    },
    // {@link https://vitejs.dev/config/shared-options.html#define}
    define: {
      'import.meta.env.PROD': isProd,
      // {@link https://vitest.dev/config/#configuration}
      'import.meta.vitest': isTest,
      ...(isTest
        ? {
            // global function for testing unit only
            mount: null,
            shallowMount: null,
            shallowMountView: null,
            createComponentMocks: null,
            createModuleStore: null,
          }
        : {}),
    },
    build: isProd ? buildProd : {},
    // settings for vitest
    test: {
      globals: true,
      environment: 'jsdom',
      environmentOptions: {},
      setupFiles: [
        './tests/unit/setup.ts',
        './tests/unit/setup-mock-server.ts',
        './tests/unit/matchers.ts',
      ],
      globalSetup: ['./tests/unit/global-setup.ts'],
      // extras alias that will be added to resolve.alias below
      alias: {},
      coverage: {
        reporter: ['text', 'json', 'html'],
        reportsDirectory: './tests/unit/coverage',
        include: ['src/**/*.{js,vue,ts,jsx,tsx,cjs,mjs,cts,mts}'],
        exclude: [
          ...coverageConfigDefaults.exclude,
          'src/**/_globals.ts',
          'src/**/*.d.ts',
          '**/node_modules/**',
          'src/main.ts',
          'src/App.vue',
          'src/router/index.ts',
          'src/router/routes.ts',
          'src/stores/store.ts',
          'src/stores/helpers.ts',
          'src/stores/index.ts',
        ],
        src: ['./src'],
      },
      // For mocking css module
      css: {
        modules: {
          classNameStrategy: 'non-scoped',
        },
      },
    },
    plugins: [
      // auto add resolve.alias from tsconfig files
      tsconfigPaths({
        loose: true,
      }),
      vue({
        isProduction: isProd,
        template: {
          compilerOptions: {
            // Remove any `data-test` prop, attribute from vue templates
            nodeTransforms: isProd
              ? [(node: any) => removeAttrFromTemplate(node, 'data-test')]
              : [],
          },
        },
      }),
      // support jsx
      vueJsx(),
      VueI18nPlugin({
        runtimeOnly: isProd,
        compositionOnly: true,
        fullInstall: false,
      }),
      // build for legacy browser
      LegacyPlugin({
        targets: ['defaults', 'not IE 11'],
      }),
    ] as any,
    resolve: {
      alias: {
        ...resolveAlias,
      },
    },
    css: {
      devSourcemap: !isProd,
    },
  };
});
