module.exports = {
  /**
   * See {@link https://github.com/vuejs/vue-cli/tree/master/packages/@vue/babel-preset-app|@vue/babel-preset-app}
   */
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    /** Fix require.context is not a function
     * See {@link https://github.com/bencodezen/vue-enterprise-boilerplate/issues/219}
     */
    'macros',
    '@vue/babel-plugin-jsx',
  ],
  env: {
    test: {
      plugins: [],
    },
  },
};
