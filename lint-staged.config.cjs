/* eslint-env node */
module.exports = {
  '*.{ts,js,tsx,jsx,cts,mts,cjs,mjs}': [
    'yarn lint:eslint',
    'yarn lint:prettier',
    'yarn test:unit:file',
  ],
  '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': [
    'yarn lint:prettier --parser json',
  ],
  'package.json': ['yarn lint:prettier'],
  '*.vue': [
    'yarn lint:eslint',
    'yarn lint:stylelint',
    'yarn lint:prettier',
    'yarn test:unit:file',
  ],
  '*.scss': ['yarn lint:stylelint', 'yarn lint:prettier'],
  '*.md': ['yarn lint:markdownlint', 'yarn lint:prettier'],
  // In real world, no one want to compress file before every commit, If you want just do it manually
  // '*.{png,jpeg,jpg,gif,svg}': ['imagemin-lint-staged'],
};
