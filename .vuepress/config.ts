import appConfig from '../src/app.config.json';

module.exports = {
  title: appConfig.title + ' Docs',
  description: appConfig.description,
  themeConfig: {
    sidebar: [
      ['/', 'Introduction'],
      '/docs/development.md',
      '/docs/architecture.md',
      '/docs/tech.md',
      '/docs/routing.md',
      '/docs/state.md',
      '/docs/tests.md',
      '/docs/linting.md',
      '/docs/editors.md',
      '/docs/production.md',
      '/docs/troubleshooting.md',
    ],
  },
};
