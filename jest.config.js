const random = require('lodash/random');
const deepmerge = require('deepmerge');
const presets = require('@vue/cli-plugin-unit-jest/presets/typescript-and-babel/jest-preset');
// Use a random port number for the mock API by default,
// to support multiple instances of Jest running
// simultaneously, like during pre-commit lint.
process.env.MOCK_API_PORT = process.env.MOCK_API_PORT || random(9000, 9999);

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const config = deepmerge(presets, {
  globalSetup: '<rootDir>/tests/unit/global-setup.ts',
  globalTeardown: '<rootDir>/tests/unit/global-teardown.ts',
  setupFiles: [],
  setupFilesAfterEnv: [
    '<rootDir>/tests/unit/setup.ts',
    '<rootDir>/tests/unit/setup-mock-server.ts',
    '<rootDir>/tests/unit/matchers.ts',
  ],
  timers: 'modern', // fake timer
  testMatch: ['**/(*.)unit.+(ts|tsx|js|jsx)'],

  transform: {},
  moduleNameMapper: {
    ...require('./aliases.config').jest,
    // Map with module in node_modules
    '^.+\\.(css|styl|less|sass|scss|jpg|jpeg|png|svg|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'jest-transform-stub',
  },
  coverageDirectory: '<rootDir>/tests/unit/coverage',

  collectCoverageFrom: [
    'src/**/*.{js,vue,ts,jsx,tsx}',
    '!src/**/_globals.ts',
    '!src/**/*.d.ts',
    '!**/node_modules/**',
    '!src/main.ts',
    '!src/App.vue',
    '!src/router/index.ts',
    '!src/router/routes.ts',
    '!src/state/store.ts',
    '!src/state/helpers.ts',
    '!src/state/index.ts',
    '!src/state/module-loader.ts',
  ],

  // https://facebook.github.io/jest/docs/en/configuration.html#testurl-string
  // Set the `testURL` to a provided base URL if one exists, or the mock API base URL
  // Solves: https://stackoverflow.com/questions/42677387/jest-returns-network-error-when-doing-an-authenticated-request-with-axios
  testURL:
    process.env.API_BASE_URL || `http://localhost:${process.env.MOCK_API_PORT}`,

  globals: {
    'vue-jest': {
      /**
       * Set to `false` if don't use css module.
       * See {@link https://vue-loader.vuejs.org/guide/css-modules.html#usage|css-modules}
       */
      experimentalCSSCompile: true,
    },
    mount: false,
    shallowMount: false,
    shallowMountView: false,
    createComponentMocks: false,
    createModuleStore: false,
  },
});
/**
 * Igonore transform all module in node_modules/** except module moduleA and moduleB
 */
// config.transformIgnorePatterns = [
// 'node_modules/(?!(moduleA|moduleB)/)',
// ];
module.exports = config;
