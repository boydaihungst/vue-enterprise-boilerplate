<script>
  import appConfig from '@src/app.config.json';

  export default {
    metaInfo: {
      // All subcomponent titles will be injected into this template.
      /**
       * @param {string|function} title
       */
      titleTemplate(title) {
        title = typeof title === 'function' ? title(this.$store) : title;
        return title ? `${title} | ${appConfig.title}` : appConfig.title;
      },
      link: [
        {
          rel: 'stylesheet',
          href:
            'https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,600;1,700;1,800;1,900&display=swap',
          body: true,
        },
      ],
    },
  };
</script>

<template>
  <div id="app">
    <!--
    Even when routes use the same component, treat them
    as distinct and create the component again.
    -->
    <RouterView :key="$route.fullPath" />
  </div>
</template>

<!-- This should generally be the only global CSS in the app. -->
<style lang="scss">
  // Allow element/type selectors, because this is global CSS.
  // stylelint-disable selector-max-type, selector-class-pattern

  // Normalize default styles across browsers,
  // https://necolas.github.io/normalize.css/
  @import '~normalize.css/normalize.css';
  // Style loading bar between pages.
  // https://github.com/rstacruz/nprogress
  @import '~nprogress/nprogress.css';

  // Design variables and utilities from src/design.
  @import '@design';
  // @import 'tailwindcss/base';
  // @import 'tailwindcss/components';
  // @import 'tailwindcss/utilities';
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    background: $color-body-bg;
  }
  #app {
    @extend %typography-small;
  }

  // ===
  // Base element styles
  // ===

  a,
  a:visited {
    color: $color-link-text;
  }

  h1 {
    @extend %typography-xxlarge;
  }

  h2 {
    @extend %typography-xlarge;
  }

  h3 {
    @extend %typography-large;
  }

  h4 {
    @extend %typography-medium;
  }

  h5,
  h6 {
    @extend %typography-small;
  }

  // ===
  // Vendor
  // ===

  #nprogress .bar {
    background: $color-link-text;
  }

  .grecaptcha-badge {
    visibility: hidden;
  }
</style>
