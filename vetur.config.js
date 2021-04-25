// vetur.config.js
/** @type {import('vls').VeturConfig} */
module.exports = {
  projects: [
    {
      package: './package.json',
      tsconfig: './tsconfig.json',
      root: './',
      globalComponents: [
        './src/router/layouts/*.vue',
        {
          name: 'BaseButton',
          path: './src/components/_base-button.vue',
        },
        {
          name: 'BaseIcon',
          path: './src/components/_base-icon.vue',
        },
        {
          name: 'BaseInputText',
          path: './src/components/_base-input-text.vue',
        },
        {
          name: 'BaseLink',
          path: './src/components/_base-link.vue',
        },
      ],
    },
  ],
};
