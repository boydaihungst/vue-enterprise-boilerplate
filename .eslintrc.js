module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/prettier',
  ],

  parserOptions: {
    jsx: true,
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },

  plugins: ['import', 'promise'],

  rules: {
    // Only allow debugger in development
    'no-debugger': process.env.PRE_COMMIT ? 'error' : 'off',
    // Only allow `console.log` in development
    'no-console': process.env.PRE_COMMIT
      ? ['error', { allow: ['warn', 'error'] }]
      : 'off',
    'import/no-relative-parent-imports': 'error',
    'import/order': 'error',
    'vue/array-bracket-spacing': 'error',
    'vue/arrow-spacing': 'error',
    'vue/block-spacing': 'error',
    'vue/brace-style': 'error',
    'vue/camelcase': 'error',
    'vue/comma-dangle': ['error', 'always-multiline'],
    'vue/component-name-in-template-casing': 'error',
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
    'import/prefer-default-export': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },

  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/*.{spec,unit}.{j,t}s?(x)'],
      env: {
        jest: true,
      },
      globals: {
        mount: false,
        shallowMount: false,
        shallowMountView: false,
        createComponentMocks: false,
        createModuleStore: false,
      },
    },
    {
      files: ['**/*.{vue,ts,tsx}'],
      extends: [
        '@vue/typescript/recommended',
        '@vue/prettier/@typescript-eslint',
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': ['warn'],
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
};
