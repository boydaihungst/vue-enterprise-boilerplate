// This is a template for a jsconfig.json file which will be
// generated when starting the dev server or a build.
const isTestEnv = Object.keys(process.env).some((envKey) =>
  ['PRE_COMMIT', 'VUE_APP_TEST'].includes(envKey)
);
module.exports = {
  baseUrl: '.',
  include: ['src/**/*', 'tests/**/*'],
  exclude: [
    'node_modules',
    'dist',
    ...(!isTestEnv
      ? [
          // Only let typescript compiles these files/folder in test env, or precommit
          'tests/**/*',
          'src/**/*.unit.ts',
          'src/**/*.spec.ts',
          'src/**/*.test.ts',
        ]
      : []),
  ],
  compilerOptions: {
    baseUrl: '.',
    target: 'esnext',
    module: 'esnext',
    strict: true,
    outDir: './dist',
    noImplicitAny: false,
    strictNullChecks: true, // Please dont set it to false or vetur will fail to check type
    jsx: 'preserve',
    importHelpers: true,
    sourceMap: true,
    resolveJsonModule: true,
    moduleResolution: 'node',
    experimentalDecorators: true,
    allowJs: true,
    skipLibCheck: false,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    typeRoots: ['node_modules/@types', 'src/@types'],
    lib: ['esnext', 'dom', 'dom.iterable', 'scripthost'],
    removeComments: true,
    // ...
    // `paths` will be automatically generated using aliases.config.js
    // ...
  },
};
