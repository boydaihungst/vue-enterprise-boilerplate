<script lang="ts">
  import appConfig from '@src/app.config.json';
  import { defineComponent, provide, ref } from 'vue';
  import { useActiveMeta, useMeta } from 'vue-meta';
  import { InjectKey } from '@utils/const';

  export default defineComponent({
    setup() {
      /**
       * Vue-meta use Teleport to apply meta data.
       * {@link https://github.com/nuxt/vue-meta/blob/next/examples/_static/client-only.html}
       */
      useMeta({
        // see metainfo tag in template > v-slot:base in template below
        // base: { href: '', target: '_blank' },
        charset: 'utf8',
        // see metainfo tag in template> v-slot:title in template below
        title: appConfig.title,
        description: appConfig.description,
        // see metainfo tag in template> v-slot:og(title) in template below
        og: {
          title: 'Og Title',
          description: 'Bla bla',
          image: [
            'https://picsum.photos/600/400/?image=80',
            'https://picsum.photos/600/400/?image=82',
          ],
        },
        // this will teleport to head tag
        head: [
          {
            // this will teleport to head tag: <link rel="..." hre="....">
            // Remove if you dont use
            tag: 'link',
            rel: 'stylesheet',
            href:
              'https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,600;1,700;1,800;1,900&display=swap',
          },
        ],
        // this will teleport to body tag. see metainfo tag in template> v-slot:body in template below. Still bugged
        body: [{ tag: 'script', href: '', rel: '' }],
      });
      // Current metadat
      const metadata = useActiveMeta();
      // Contain current layout with default is main.vue
      const currentLayout = ref('main');
      // Change view layout
      const changeLayout = (layoutFileName: string) => {
        if (currentLayout.value !== layoutFileName) {
          currentLayout.value = layoutFileName;
        }
      };
      // Provide to router/layouts/layout.vue to trigger update layout
      provide(InjectKey.currentLayout, currentLayout);
      provide(InjectKey.changeLayout, changeLayout);
      return {
        currentLayout,
        metadata,
      };
    },
  });
</script>

<template>
  <!--
    vue-meta use Teleport to apply meta data.
    https://v3.vuejs.org/guide/teleport.html
    https://github.com/nuxt/vue-meta/blob/next/examples/_static/client-only.html
   -->
  <metainfo>
    <!-- <template v-slot:base="{ content }">
      {{ content }}
    </template> -->
    <template v-slot:title="{ content, metainfo }">
      {{ content }} - {{ metainfo.description }}
    </template>
    <template v-slot:og(title)="{ content, metainfo, og }">
      {{ content }} - {{ og.description }} - {{ metainfo.description }}
    </template>
    <template v-slot:body="{ metainfo }">
      <component
        :is="script.tag"
        v-for="script in metainfo"
        :key="script.href"
        :rel="script.rel"
        :src="script.href"
      ></component>
    </template>
  </metainfo>
  <component :is="currentLayout" v-bind="$attrs">
    <router-view />
  </component>
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
