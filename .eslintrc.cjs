/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,

  env: {
    es2021: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:import/typescript',
    'plugin:promise/recommended',
    'plugin:@typescript-eslint/recommended',
    '@vue/eslint-config-typescript',
    'plugin:@intlify/vue-i18n/recommended',
    '@vue/eslint-config-prettier',
  ],
  overrides: [
    {
      env: {
        mocha: true,
        'cypress/globals': true,
      },
      rules: {
        strict: 'off',
      },
      files: ['tests/e2e/**/*.{cy,spec,e2e}.{js,ts,jsx,tsx}'],
      extends: ['plugin:cypress/recommended'],
    },
  ],
  settings: {
    'vue-i18n': {
      localeDir: './src/lang/*.{json,json5,yaml,yml}',
      messageSyntaxVersion: '^9.2.2',
    },
  },
  plugins: ['promise'],
  rules: {
    // 'import/no-relative-parent-imports': 'error',
    // 'import/order': 'error',
    // 'import/prefer-default-export': 'off',
    'no-undef': 'off',
    'vue/array-bracket-spacing': 'error',
    'vue/arrow-spacing': 'error',
    'vue/block-spacing': 'error',
    'vue/brace-style': 'error',
    'vue/camelcase': 'error',
    'vue/comma-dangle': ['error', 'always-multiline'],
    'vue/component-name-in-template-casing': 'error',
    'vue/multi-word-component-names': 'off',
    'vue/dot-location': ['error', 'property'],
    'vue/eqeqeq': 'error',
    'vue/key-spacing': 'error',
    'vue/keyword-spacing': 'error',
    'vue/no-boolean-default': ['error', 'default-false'],
    'vue/no-deprecated-scope-attribute': 'error',
    'vue/no-empty-pattern': 'error',
    'vue/object-curly-spacing': ['error', 'always'],
    'vue/padding-line-between-blocks': 'error',
    'vue/space-infix-ops': 'error',
    'vue/space-unary-ops': 'error',
    'vue/v-on-function-call': 'error',
    'vue/v-slot-style': [
      'error',
      {
        atComponent: 'v-slot',
        default: 'v-slot',
        named: 'longform',
      },
    ],
    'vue/valid-v-slot': 'error',
    'max-classes-per-file': 'off',
    'no-useless-constructor': 'off',
    'no-empty-function': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: ['const', 'let', 'var', 'case', 'default'],
        next: '*',
      },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
      {
        blankLine: 'always',
        prev: '*',
        next: ['interface', 'type', 'function'],
      },
    ],
    '@intlify/vue-i18n/no-raw-text': [
      'warn',
      {
        attributes: {
          '/.+/': [
            'title',
            'aria-label',
            'aria-placeholder',
            'aria-roledescription',
            'aria-valuetext',
          ],
          input: ['placeholder'],
          img: ['alt'],
        },
        ignoreNodes: ['md-icon', 'v-icon'],
        ignorePattern: '^[-#:()&]+$',
        ignoreText: [],
      },
    ],
  },
};
