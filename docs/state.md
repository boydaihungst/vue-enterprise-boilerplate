# State management

- [State management](#state-management)
  - [Store](#stores)
  - [Init action](#init action)
  - [Testing](#testing)
  - [Store in Store](#store in store)
  - [Typescript](#typescript)

## Stores

The `src/stores/root.module.ts` file is where all shared application state lives. Just add new store with name convention like `store_name.module.ts`. And then export though `index.ts` file.Read more in the [Pinia store](https://pinia.vuejs.org/) docs.

Tips: Be careful about Ref and Reactive state, getter and [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

## `Init` action

Every `store` should define and return `init` action, which will run at startup of the app. This action should contains logic like read data from localstorage, add watch, watcheffect which you only want to run once time.

Here's an example:

```ts
// auth.module.ts
function init() {
  // Restoring user information and access token from localstorage
  const restoredCurrentUserAsString = localStorage.getItem(
    PersistStateKey.user,
  );

  try {
    if (restoredCurrentUserAsString) {
      currentUser.value = JSON.parse(restoredCurrentUserAsString);
      setDefaultAuthHeaders(currentUser.value?.token);
    }
  } catch (error: unknown) {
    localStorage.removeItem(PersistStateKey.user);
  }

  // Auto update authorization header after current user changed
  // then save current user's information, including access token, to localStorage
  const authStore = useAuthStore();

  watch(
    toRef(authStore, 'currentUser'),
    (newUserInfo) => {
      try {
        localStorage.setItem(
          PersistStateKey.user,
          JSON.stringify(unref(newUserInfo)),
        );
        setDefaultAuthHeaders(newUserInfo?.token);
      } catch (error: unknown) {
        localStorage.removeItem(PersistStateKey.user);
        setDefaultAuthHeaders('');
      }
    },
    { deep: true, flush: 'pre' },
  );
}
```

## Testing

Each store should have 1 test file with name `store_name.spec.ts`. When you want to unit test a store. Just remmeber to mock store before each test using code below. Utility `createModuleStore` is declared in [/@types/global.d.ts](../@types/global.d.ts) file and is implemented in [/tests/unit/setup.ts](../tests/unit/setup.ts#L190-L204) file.

```ts
  beforeEach(async () => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`

    // This `createModuleStore` utility function will auto add
    const store = await createModuleStore({
    // If set to true, every action will be mock with vi.spyOn().
    // Set to false if run the real code inside action functions.
      stubActions: false,
    });

    setActivePinia(store);
    window.localStorage.clear();
  });
  it('test store ...', () => {
    const rootStore = useRootStore();
    // Keep states and getters reactive;
    const { stateA, getterB } = storeToRefs(store)

    // action
    rootStore.actionC(...);
    // Some time you should wait for UI is updated
    await flushPromises();
    expect(...)
  })
```

Testing include state, getter, action.

## Use Store in Store

If you want to access another store inside a store just useOtherStore() like normal. Remember that only access state, getter, action of that module in action function. Example check [user.module.ts](../src/stores/user.module.ts)
[Read more](https://pinia.vuejs.org/core-concepts/outside-component-usage.html)

## Typescript

Pinia store support typescript by default. There are some rare cases you would want to declare type. Like add custom plugin to store, add extra properties to store instance, example: `persist-state.plugin.ts`, which auto save all state of a store to localStorage. Then you should update this file [/@types/pinia.d.ts](../@types/pinia.d.ts) follow the guide from [here](https://pinia.vuejs.org/core-concepts/plugins.html#typescript)
