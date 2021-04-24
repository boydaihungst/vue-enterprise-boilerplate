# Architecture

- [Architecture](#architecture)
  - [`.circleci`](#circleci)
  - [`.devcontainer (optional)`](#devcontainer-optional)
    - [`devcontainer.json`](#devcontainerjson)
  - [`.vscode`](#vscode)
  - [`.vuepress`](#vuepress)
  - [`deploy (optional)`](#deploy-optional)
  - [`docs`](#docs)
  - [`generators`](#generators)
  - [`public`](#public)
    - [`index.html`](#indexhtml)
    - [`mockServiceWorker.js`](#mockServiceWorkerjs)
  - [`src`](#src)
    - [`@types`](#@types)
    - [`assets`](#assets)
    - [`components`](#components)
    - [`composables (optional)`](#composables-optional)
    - [`design`](#design)
    - [`directives`](#directives)
    - [`lang`](#lang)
    - [`models`](#models)
    - [`plugin`](#plugin)
    - [`router`](#router)
    - [`state`](#state)
    - [`utils`](#utils)
    - [`app.config.json`](#appconfigjson)
    - [`App.vue`](#appvue)
    - [`main.ts`](#maints)
  - [`tests`](#tests)
  - [`vetur`](#vetur)

## `.circleci`

Configuration for continuous integration with [Circle CI](https://circleci.com/). See [the production doc](production.md#from-circle-ci) for more.

## `.devcontainer` (optional)

### `devcontainer.json`

Configuration for development inside a Docker container with vscode. See [development doc](development.md#docker-optional) for more.

## `.vscode`

Settings and extensions specific to this project, for Visual Studio Code. See [the editors doc](editors.md#visual-studio-code) for more.

## `.vuepress`

[VuePress](https://vuepress.vuejs.org/) configuration for docs static site generation.

## `deploy` (optional)

Includes all file you need for deployment. Nginx config, scripts....

## `docs`

You found me! :wink:

## `generators`

Generator templates to speed up development. See [the development doc](development.md#generators) for more.

## `public`

Where you'll keep any static assets, to be added to the `dist` directory without processing from our build system.

### `index.html`

This one file actually _does_ get processed by our build system, allowing us to inject some information from Webpack with [EJS](http://ejs.co/), such as the title, then add our JS and CSS.

### `mockServiceWorker.js`

This file is used by Mock Service Worker allowing us to mock API locally for test, develoment. Don't modify this file or mock service will not work any more. It's won't include in the production build so don't be worry about that.

## `src`

Where we keep all our source files.

### `@types`

Include all declare merging file. See [tech doc](tech.md#typescript) for more details.

### `assets`

This project manages assets via Vue CLI. Learn more about [its asset handling here](https://cli.vuejs.org/guide/html-and-static-assets.html).

### `@composables` (optional)

Where we keep our composable APIs, renderless components

### `components`

Where most of the components in our app will live, including our [global base components](development.md#base-components).

### `design`

Where we keep our [design variables and tooling](tech.md#design-variables-and-tooling).

### `directives`

Directory that contains our global directives.

### `lang`

Directory that contains translation files. Required for i18n plugin.

### `models`

Directory that contains model: interface, type, class

### `plugin`

Directory that contains custom plugins need for app to run like i18n, vue-meta. For extenal plugin just add to `plugin/index.ts`

### `router`

Where the router, routes, and any routing-related components live. See [the routing doc](routing.md) for more.

### `state`

Where all our global state management lives. See [the state management doc](state.md) for more.

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

## `vetur`

Where we create custom configs for better vetur intellisense. Default vetur don't suggest attribute for mixin, so we have to define by ourselves. Run `yarn vetur` to automatically generate theses config.
