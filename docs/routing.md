# Routing, layouts, and views

- [Overview](#overview)
- [Layouts](#layouts)
- [Views](#views)

## Overview

This project uses [Vue Router](tech.md#vue-router), which we initialize in `src/router/index.ts`, with routes defined in `src/router/routes.ts`. Inside the `src/router` folder, there are also two sub-folders, both containing route-specific components: `layouts` and `views`.

## Layouts

~Every view component must use a layout component as its base and register it as `Layout`, as this convention helps us mock out layout components when testing views.~ Use per App-level layout to prevent forgot to add layout to `view` components, Don't Repeat Your Self. Layouts usually aren't very complex, often containing only shared HTML like headers, footers, and navigation to surround the main content in the view.

## Views

Each view component will be used by at least one route in `src/router/routes.ts`, to provide a template for the page. They can technically include some additional properties from Vue Router [to control navigation](https://next.router.vuejs.org/guide/advanced/navigation-guards.html), for example to [fetch data](https://next.router.vuejs.org/guide/advanced/data-fetching.html) before creating the component, but I recommend adding these guards to `src/router/routes.ts` instead, as that behavior typically has much more to do with the route (and will sometimes be shared between routes) than it does the view component.
