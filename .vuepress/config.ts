import { defaultTheme } from '@vuepress/theme-default';
import { app } from '../src/lang/en.json';

export default {
  title: app.title + ' Docs',
  description: app.description,
  home: '/',
  theme: defaultTheme({
    sidebar: [
      {
        text: 'development',
        link: '/docs/development.md',
      },
      {
        text: 'architecture',
        link: '/docs/architecture.md',
      },
      {
        text: 'tech',
        link: '/docs/tech.md',
      },
      {
        text: 'routing',
        link: '/docs/routing.md',
      },
      {
        text: 'state',
        link: '/docs/state.md',
      },
      {
        text: 'tests',
        link: '/docs/tests.md',
      },
      {
        text: 'linting',
        link: '/docs/linting.md',
      },
      {
        text: 'editors',
        link: '/docs/editors.md',
      },
      {
        text: 'production',
        link: '/docs/production.md',
      },
      {
        text: 'troubleshooting',
        link: '/docs/troubleshooting.md',
      },
    ],
  }),
};
