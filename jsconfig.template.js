// This is a template for a jsconfig.json file which will be
// generated when starting the dev server or a build.

module.exports = {
  baseUrl: '.',
  include: ['src/**/*', 'tests/**/*'],
  exclude: ['node_modules', 'dist'],
  compilerOptions: {
    baseUrl: '.',
    target: 'esnext',
    module: 'esnext',
    moduleResolution: 'node',
    resolveJsonModule: true,
    allowSyntheticDefaultImports: true,
    typeRoots: ['node_modules/@types', '@types'],
    removeComments: true,
    checkJs: true,
    // ...
    // `paths` will be automatically generated using aliases.config.js
    // ...
  },
};
