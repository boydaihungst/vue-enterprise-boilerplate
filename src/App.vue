<script setup lang="ts">
  // Normalize default styles across browsers,
  // https://necolas.github.io/normalize.css/
  import 'normalize.css';

  // Style loading bar between pages.
  // https://github.com/rstacruz/nprogress
  import { useRootStore } from '@stores';
  import { useHead, useSeoMeta } from '@unhead/vue';
  import 'nprogress/nprogress.css';
  import { storeToRefs } from 'pinia';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  /**
   * use seometa for some popular site like: google, twitter...
   * or use `useHead` for fully customize meta
   * {@link https://harlanzw.com/blog/vue-use-head-v1#v100-release}
   */
  // this will teleport to head tag
  useSeoMeta({
    charset: 'utf8',
    ogImage: [
      {
        url: 'https://picsum.photos/600/400/?image=80',
        alt: '',
      },
      {
        url: 'https://picsum.photos/600/400/?image=82',
        alt: '',
      },
    ],
    ogTitle: 'Og title',
    ogDescription: 'Og description',
  });

  useHead({
    title: t('app.title'),
    // Configures dynamic template to customize the page title on an individual page.
    titleTemplate: (title) => `My App - ${title}`,

    // these tags will teleport into head tag
    // Each element in the array is mapped to a newly-created <meta> tag, where object properties are mapped to the corresponding attributes.
    meta: [
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1',
      },
      { name: 'og:title', content: 'Og title' },
      { name: 'og:description', content: 'Og description' },
      { name: 'og:image', content: 'https://picsum.photos/600/400/?image=80' },
      { name: 'og:image', content: 'https://picsum.photos/600/400/?image=82' },
      { name: 'description', content: t('app.description') },
    ],
    // Each element in the array is mapped to a newly-created <link> tag, where object properties are mapped to the corresponding attributes.
    link: [
      {
        as: 'style',
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,600;1,700;1,800;1,900&display=swap',
      },
    ],
    // Each element in the array is mapped to a newly-created <style> tag, where object properties are mapped to the corresponding attributes.
    style: [],
    // Each element in the array is mapped to a newly-created <script> tag, where object properties are mapped to the corresponding attributes.
    script: [],
    // Each element in the array is mapped to a newly-created <noscript> tag, where object properties are mapped to the corresponding attributes.
    noscript: [],
    // Sets attributes of the <body> tag. Each object property is mapped to the corresponding attribute.
    bodyAttrs: {},
    //Sets attributes of the <html> tag. Each object property is mapped to the corresponding attribute.
    htmlAttrs: {},
  });
  const { currentViewLayout } = storeToRefs(useRootStore());
</script>

<template>
  <component :is="currentViewLayout" v-bind="$attrs">
    <router-view />
  </component>
</template>

<!-- This should generally be the only global CSS in the app. -->
<style lang="scss">
  // Allow element/type selectors, because this is global CSS.
  // stylelint-disable selector-max-type, selector-class-pattern

  // Design variables and utilities from src/design.
  @import '@design';

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

  .ripple-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .ripple-effect {
    position: relative;
    z-index: 9999;
    width: 1px;
    height: 1px;
    margin-top: 0;
    margin-left: 0;
    pointer-events: none;
    border-radius: 50%;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>
