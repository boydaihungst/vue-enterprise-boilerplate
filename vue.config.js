const WorkerPlugin = require('worker-plugin');
const DuplicatePackageCheckerWebpackPlugin = require('duplicate-package-checker-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const appConfig = require('./src/app.config');

/** @type import('@vue/cli-service').ProjectOptions */
module.exports = {
  // https://github.com/neutrinojs/webpack-chain/tree/v4#getting-started
  chainWebpack(config) {
    // We provide the app's title in Webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.set('name', appConfig.title);

    // Set up all the aliases we use in our app.
    config.resolve.alias.clear().merge(require('./aliases.config').webpack);

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
    config.output.globalObject('this');
    config
      .plugin('worker-plugin')
      .use(WorkerPlugin, [{ globalObject: 'this' }]);
    config.module
      .rule('graphql-file-loader')
      .test(/\.graphql$/)
      .exclude.add(/node_modules/)
      .end()
      .use('graphql-persisted-document-loader')
      .loader('graphql-persisted-document-loader')
      .end()
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .after('graphql-persisted-document-loader')
      .end();
    if (process.env.NODE_ENV === 'production') {
      config
        .plugin('DuplicatePackageCheckerWebpackPlugin')
        .use(DuplicatePackageCheckerWebpackPlugin);

      config.plugins.delete('prefetch');
      config.plugin('CompressionPlugin').use(CompressionPlugin);
      config.optimization.runtimeChunk('single').splitChunks({ chunks: 'all' });
      config.optimization.concatenateModules(true);
      config.optimization
        .minimizer('UglifyJsPlugin')
        .use(UglifyJsPlugin, [
          {
            cache: true,
            parallel: true,
            sourceMap: false,
            extractComments: 'all',
            uglifyOptions: {
              compress: true,
              output: null,
            },
          },
        ])
        .use(OptimizeCSSAssetsPlugin, [
          {
            cssProcessorOptions: {
              safe: true,
              discardComments: {
                removeAll: true,
              },
            },
          },
        ]);

      config
        .plugin('BundleAnalyzerPlugin')
        .use(BundleAnalyzerPlugin, [
          { analyzerMode: 'server', analyzerPort: 'auto', openAnalyzer: false },
        ]);
    }
  },
  css: {
    // Enable CSS source maps.
    sourceMap: true,
    requireModuleExtension: false,
    loaderOptions: {
      css: {
        modules: true,
      },
      // postcss: {
      //   execute: true,
      //   postcssOptions: {
      //     parser: require('postcss-js'),
      //     plugins: [
      //       [require('postcss-import')],
      //       [require('tailwindcss')],
      //       [require('autoprefixer')],
      //       [require('postcss-preset-env')],
      //     ],
      //   },
      // },
    },
  },
  // Configure Webpack's dev server.
  // https://cli.vuejs.org/guide/cli-service.html
  devServer: {
    host: 'localhost',
    https: true,
    ...(process.env.API_BASE_URL
      ? // Proxy API endpoints to the production base URL.
        { proxy: { '/api': { target: process.env.API_BASE_URL } } }
      : // Proxy API endpoints a local mock API.
        { before: require('./src/tests/mock-api') }),
  },
};
