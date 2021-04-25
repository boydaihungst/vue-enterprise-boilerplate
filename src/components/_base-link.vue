<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { RouteLocationRaw } from 'vue-router';
  import isString from 'lodash/isString';

  export default defineComponent({
    props: {
      allowInsecure: {
        type: Boolean,
        default: false,
      },
      to: {
        type: [Object, String] as PropType<RouteLocationRaw>,
        default: null,
      },
      params: {
        type: Object,
        default: () => ({}),
      },
      name: {
        type: String,
        default: undefined,
      },
      href: {
        type: String,
        default: undefined,
      },
      target: {
        type: String,
        default: '_blank',
      },
    },
    computed: {},
    created() {
      this.validateProps();
    },
    methods: {
      routerLinkTo(route?: Record<string, any>) {
        if (isString(this.to)) return this.to;
        return {
          name: route?.name || this.name,
          params: route?.params || this.params,
          ...(this.to || {}),
        };
      },
      validateUrlSecure() {
        const isInsecureUrl =
          !this.allowInsecure && !/^(https|mailto|tel):/.test(this.href);
        if (isInsecureUrl) {
          return console.warn(
            `Insecure <BaseLink> href: ${this.href}.\nWhen linking to external sites, always prefer https URLs. If this site does not offer SSL, explicitly add the allow-insecure attribute on <BaseLink>.`
          );
        }
      },
      validateUrlIsLocal() {
        const isLocalUrl = !/^\w+:/.test(this.href);
        if (isLocalUrl) {
          return console.warn(
            `Invalid <BaseLink> href: ${this.href}.\nIf you're trying to link to a local URL, provide at least a name or to`
          );
        }
      },
      validateRouterLinkProp() {
        const insufficientProp = !this.name && !this.to;
        if (insufficientProp) {
          return console.warn(
            `Invalid <BaseLink> props:\n\n${JSON.stringify(
              this.$props,
              null,
              2
            )}\n\nEither a \`name\` or \`to\` is required for internal links, or an \`href\` for external links.`
          );
        }
      },
      // Perform more complex prop validations than is possible
      // inside individual validator functions for each prop.
      validateProps() {
        if (process.env.NODE_ENV === 'production') return;
        if (this.href) {
          this.validateUrlSecure();
          this.validateUrlIsLocal();
        } else {
          // Check for insufficient props.
          this.validateRouterLinkProp();
        }
      },
    },
  });
</script>

<template>
  <a v-if="!!href" :href="href" :target="target" v-bind="$attrs">
    <slot />
  </a>
  <RouterLink v-else v-slot="scopedSlot" :to="routerLinkTo()" custom>
    <slot v-bind="scopedSlot"></slot>
  </RouterLink>
</template>
