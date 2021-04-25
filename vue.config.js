const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin;
// const DuplicatePackageCheckerWebpackPlugin = require('duplicate-package-checker-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const appConfig = require('./src/app.config.json');
const aliases = require('./aliases.config');
/** @type import('@vue/cli-service').ProjectOptions */
module.exports = {
  /** See {@link https://github.com/neutrinojs/webpack-chain/tree/v4#getting-started} */
  chainWebpack(config) {
    config.devtool(process.NODE_ENV === 'development' ? 'source-map' : false);
    // We provide the app's title in Webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.set('name', appConfig.title);

    // Set up all the aliases we use in our app.
    config.resolve.alias
      .clear()
      .merge(aliases.webpack)
      .merge({
        /** Optimize for production build.
         * See {@link https://github.com/darrenscerri/duplicate-package-checker-webpack-plugin#resolving-duplicate-packages-in-your-bundle|resolving-duplicate-packages-in-your-bundle}
         */
        tslib: path.resolve(__dirname, 'node_modules/tslib'),
        'core-js': path.resolve(__dirname, 'node_modules/core-js'),
        'hash.js': path.resolve(__dirname, 'node_modules/hash.js'),
        lodash: path.resolve(__dirname, 'node_modules/lodash'),
        axios: path.resolve(__dirname, 'node_modules/axios'),
      });
    // Don't allow importing .vue files without the extension, as
    // it's necessary for some Vetur autocompletions.
    config.resolve.extensions.delete('.vue');

    // Only enable performance hints for production builds,
    // outside of tests.
    config.performance.hints(
      process.env.NODE_ENV === 'production' &&
        !process.env.VUE_APP_TEST &&
        'warning'
    );

    /**
     * Webpack 5 don't need worker-loader anymore
     * {@link https://webpack.js.org/guides/web-workers/|web-workers}
     */
    // config
    //   .plugin('worker-plugin')
    //   .use(WorkerPlugin, [{ globalObject: 'this' }]);
    // Optimize for production build
    if (process.env.NODE_ENV === 'production') {
      /**
       * Remove all `data-test` attribute
       * {@link https://next.vue-test-utils.vuejs.org/guide/essentials/a-crash-course.html#the-first-test-a-todo-is-rendered}
       */
      config.module
        .rule('vue')
        .use('vue-loader')
        .tap((options) => {
          let compilerOptions = options.compilerOptions || {};
          compilerOptions.modules = [
            {
              preTransformNode(astEl) {
                if (process.env.NODE_ENV === 'production') {
                  const { attrsMap, attrsList } = astEl;
                  if (attrsMap['data-test']) {
                    delete attrsMap['data-test'];
                    const index = attrsList.findIndex(
                      (x) => x.name === 'data-test'
                    );
                    attrsList.splice(index, 1);
                  }
                }
                return astEl;
              },
            },
          ];
          return options;
        });
      /**
       * Use this plugin to check duplicated package.
       * yarn add -D duplicate-package-checker-webpack-plugin
       */
      // config
      //   .plugin('DuplicatePackageCheckerWebpackPlugin')
      //   .use(DuplicatePackageCheckerWebpackPlugin);

      /**
       * Decrease bandwidth for mobile
       * {@link https://cli.vuejs.org/guide/html-and-static-assets.html#prefetch}
       */
      config.plugins.delete('prefetch');
      // https://www.npmjs.com/package/compression-webpack-plugin
      config.plugin('CompressionPlugin').use(CompressionPlugin);
      // config.optimization.runtimeChunk('single').splitChunks({ chunks: 'all' });
      config.optimization.splitChunks({ chunks: 'all' });
      config.optimization.concatenateModules(true);

      /**
       *
       * {@link https://github.com/webpack-contrib/webpack-bundle-analyzer}
       */
      // config
      //   .plugin('BundleAnalyzerPlugin')
      //   .use(BundleAnalyzerPlugin, [
      //     { analyzerMode: 'static', analyzerPort: 'auto', openAnalyzer: false },
      //   ]);

      /**
       * Optimize for vue-i18n
       * {@link https://vue-i18n.intlify.dev/guide/advanced/optimization.html#optimization}
       */
      config.resolve.alias.merge({
        'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
      });
      config.externals(['Vue']);

      // Exclude mock service worker from build
      config.plugin('copy').use(CopyPlugin, [
        {
          patterns: [
            {
              from: path.resolve(__dirname, 'public'),
              to: path.resolve(__dirname, 'dist'),
              noErrorOnMissing: true,
              toType: 'dir',
              globOptions: {
                ignore: [
                  'mockServiceWorker.js',
                  '**/.DS_Store',
                  '/home/boydaihungst/Gits/vue-enterprise-boilerplate/public/index.html',
                ],
              },
            },
          ],
        },
      ]);
    }
    config.module
      .rule('mjs')
      .test(/\.mjs$/)
      .type('javascript/auto');
  },
  css: {
    // Enable CSS source maps.
    sourceMap: true,
    loaderOptions: {
      css: {
        modules: {
          auto: () => true,
        },
      },
    },
  },
  pluginOptions: {
    i18n: {
      locale: process.env.VUE_APP_I18N_LOCALE,
      fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE,
      localeDir: 'lang',
      enableLegacy: false,
      runtimeOnly: process.env.NODE_ENV === 'production',
      compositionOnly: true,
      fullInstall: true,
    },
  },
  /**
   * Configure Webpack's dev server.
   * {@link https://cli.vuejs.org/guide/cli-service.html}
   */
  devServer: {
    /**
     * true because we use msw's web service worker
     * {@link https://mswjs.io/docs/}
     */
    host: 'localhost',
    // https: true,
    ...(process.env.API_BASE_URL
      ? {
          /** {@link https://github.com/chimurai/http-proxy-middleware} */
          proxy: {
            '/api': {
              target: process.env.API_BASE_URL,
              secure: false,
              ws: true,
              changeOrigin: true,
            },
          },
        }
      : /** @deprecated Proxy API endpoints a local mock API. Using msw instead */
        {
          // Set this to prevent expressjs throw 404 not found before msw ready
          before: function (app) {
            app.all('*', function (req, res, next) {
              next();
            });
          },
        }),
  },
};
