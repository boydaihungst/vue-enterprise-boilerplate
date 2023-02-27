# Architecture

- [Architecture](#architecture)
  - [`.circleci`](#circleci)
  - [`.vscode`](#vscode)
  - [`.vuepress`](#vuepress)
  - [`@types`](#types)
  - [`deploy (optional)`](#deploy-optional)
  - [`docs`](#docs)
  - [`~generators~`](#generators)
  - [`public`](#public)
    - [`favicon`](favicon)
    - [`robots.txt`](#robotstxt)
    - [`index.html`](#indexhtml)
    - [`mockServiceWorker.js`](#mockserviceworkerjs)
  - [`src`](#src)
    - [`assets`](#assets)
    - [`components`](#components)
    - [`composables (optional)`](#composables-optional)
    - [`constraint`](#constraint)
    - [`design`](#design)
    - [`directives`](#directives)
    - [`lang`](#lang)
    - [`models`](#models)
    - [`plugin`](#plugin)
    - [`router`](#router)
    - [`stores`](#stores)
    - [`utils`](#utils)
    - [`app.config.json`](#appconfigjson)
    - [`App.vue`](#appvue)
    - [`main.ts`](#maints)
  - [`tests`](#tests)
  - [`env`](#env)
  - [`.eslintignore.cjs`](#eslintignorecjs)
  - [`.gitignore`](#gitignore)
  - [`.markdownlint.yml`](markdownlintyml)
  - [`.commitlint.config.cjs`](commitlintconfigcjs)
  - [`cypress.config.ts`](#cypressconfigts)
  - [`env.d.ts`](envdts)
  - [`tsconfig`](#tsconfigappjson)
  - [`vite.config.ts`](#viteconfigts)

## `.circleci`

Configuration for continuous integration with [Circle CI](https://circleci.com/). See [the production doc](production.md#from-circle-ci) for more.

## `.nlsp-settings`

Settings specific to this project, for Nvim nlsp-setting. See [the editors doc](editors.md#lunarvim) for more.

## `.vscode`

Settings and extensions specific to this project, for Visual Studio Code. See [the editors doc](editors.md#visual-studio-code) for more.

## `.vuepress`

[VuePress](https://vuepress.vuejs.org/) configuration for docs static site generation.

## `@types`

Include all declare merging file. See [tech doc](tech.md#typescript) for more details. Please read every files in this folder to understand how to write typesafe code

## `deploy` (optional)

Includes all file you need for deployment. Nginx config, scripts....

## `docs`

You found me! :wink:

## `~generators~`

~Generator templates to speed up development. See [the development doc](development.md#generators) for more.~

## `public`

Where you'll keep any static assets, to be added to the `dist` directory without processing from our build system.

### `favicon.ico`

A favicon is a small image displayed next to the page title in the browser tab. Just replace with your website logo before build.

### `robots.txt`

A robots.txt file tells search engine crawlers which URLs the crawler can access on your site. This is used mainly to avoid overloading your site with requests; it is not a mechanism for keeping a web page out of Google.

### `index.html`

This one file actually _does_ get processed by our build system, allowing us to inject some information from Webpack with [EJS](http://ejs.co/), such as the title, then add our JS and CSS.

### `mockServiceWorker.js`

This file is used by Mock Service Worker allowing us to mock API locally for test, develoment. Don't modify this file or mock service will not work any more. It's won't include in the production build so don't be worry about that.

## `src`

Where we keep all our source files.

### `assets`

This project manages assets via Vue CLI. Learn more about [its asset handling here](https://cli.vuejs.org/guide/html-and-static-assets.html).

### `@composables` (optional)

Where we keep our composable APIs, renderless components

### `components`

Where most of the components in our app will live, including our [global base components](development.md#base-components).

### `constraint`

where we keep const, enum file.

### `design`

Where we keep our [design variables and tooling](tech.md#design-variables-and-tooling).

### `directives`

Directory that contains our global directives.

### `lang`

Directory that contains translation files. Required for i18n plugin.

### `models`

Directory that contains model: interface, type, class

### `plugin`

Directory that contains custom plugins need for app to run like i18n, unhead, pinia store. You can put your own plugin in here as well. After that just add to `plugin/index.ts`.

### `router`

Where the router, routes, and any routing-related components live. See [the routing doc](routing.md) for more.

### `stores`

Where all our global state/store management lives. See [the state management doc](state.md) for more.

### `utils`

These are utility functions you may want to share between many files in your application. They will always be pure and never have side effects, meaning if you provide a function the same arguments, it will always return the same result. These should also never directly affect the DOM or interface with our Vuex state.

### `app.config.json`

Contains app-specific metadata.

### `App.vue`

The root Vue component that simply delegates to the router view. This is typically the only component to contain global CSS.

### `main.ts`

The entry point to our app, were we create our Vue instance and mount it to the DOM.

## `tests`

Where all our tests go. See [the tests doc](tests.md) for more.

## `Dot files`

All the dot files in root project

### `.env`

Include environment variables. Do not upload to repo. You should put it to .gitignore file

### `.eslintignore.cjs`

CommonJs configuration for eslint. Check [package.json](../package.json) for eslint plugins is installed.

### `.gitignore`

Includes file and directory that should not be upload to git repo. Ex: temporary file, cache, node_modules...

### `.markdownlint.yml`

Includes configuration for markdownlint.

### `.commitlint.config.cjs`

Includes configuration for commitlint. Which will force everyone in the project's team to follow the rules for commit's name and changelog. [Learn here](https://commitlint.js.org/#/)

## `cypress.config.ts`

Configuration for Cypress to run E2E testing. Cypress can runs component testing as well. Learn more about configuration in [here](https://docs.cypress.io/guides/references/configuration)

## `env.d.ts`

Declare types for `import.meta.env.*`. Every environment variables start with `VITE_` will be include in bundle after building (Which are used in app itself).

## `tsconfig.app.json`

Configuration for tsserver and volar. This configuration is for app, includes path alias.

## `tsconfig.config.json`

Configuration to compile all config file from ts to js.

## `tsconfig.vitest.json`

Configuration for testing. If you want to use any type from `node_modules`, just put it in here.

## `vite.config.ts`

Configuration for building app. Put vite plugins in this file.
