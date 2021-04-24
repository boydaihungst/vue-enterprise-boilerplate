# State management

- [State management](#state-management)
  - [Modules](#modules)
  - [Helpers](#helpers)
  - [Module Nesting](#module-nesting)

## Modules

The `src/state/modules` directory is where all shared application state lives. Any JS file added here (apart from unit tests) will be automatically registered in the store as a [namespaced module](https://next.vuex.vuejs.org/en/modules.html#namespacing).

Read more in the [Vuex modules](https://next.vuex.vuejs.org/en/modules.html) docs.

## Helpers

The state helpers in [`helpers.ts`](../src/state/helpers.ts) are the components' interface to the Vuex store. Depending on a component's concerns, we can import a subset of these helpers to quickly bring in the data and actions we need.

You might be thinking, "Why not just automatically inject all of these into every component?" Well, then it would be difficult to figure out where a particular part of state is coming from. As our state becomes increasingly complex, the risk would also increase of accidentally using the same names for internal component state. This way, each component remains traceable, as the necessary `import` will provide a thread back to our helpers file if we ever don't understand where something is coming from.

Here's an example:

```js
import { authComputed } from '@state/helpers';

export default {
  computed: {
    ...authComputed,
  },
};
```

## Module Nesting

Vuex modules can be nested, which sometimes makes sense for organizational purposes. For example, if you created a module:

Parent module: dashboard `src/state/modules/dashboard`

```js
// @file src/state/modules/dashboard/state.ts
export const state = {
  role: 'project-manager',
};
```

Nested module: video `src/state/modules/dashboard/video`

```js
// @file src/state/modules/dashboard/video/state.ts
export const state = {
  all: [],
};

// @file src/state/modules/dashboard/video/getter.ts
export const getters = {
  favorited(state) {
    return state.all.filter((video) => video.favorited);
  },
};
```

Then you'd be able to access those modules with:

```js
store.state.dashboard.role;
store.state.dashboard.videos.all;
store.getters['dashboard/videos/favorited'];
```

[**Deprected**] As you can see, placing the `videos` module in a folder called `dashboard` automatically nests it underneath the `dashboard` namespace. This works even if a `dashboard.js` file doesn't exist. You can also have as many levels of nesting as you want.

**For better auto typescript generation, make sure parent module is exist.**

![#d90000](https://via.placeholder.com/15/d90000/000000?text=+) **NOTE**: Don't create module by copy paste. Use commands below to generate module with fully typescript for `Store, Getter, Action, Mutation, Mappper helpers`.

Case module without nested:

> `yarn new module NoNestedModule`

**output**: `src/state/modules/no-nested-module` folder

Case nested module:

> `yarn new module parentModule/nestedModule`

**output**: `src/state/modules/parent-module/nested-module` folder
