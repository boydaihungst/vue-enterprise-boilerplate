<script setup lang="ts">
  import isString from 'lodash/isString';
  import { onMounted, watchEffect, type PropType } from 'vue';
  import type { RouteLocationRaw } from 'vue-router';
  const props = defineProps({
    allowInsecure: {
      type: Boolean,
    },
    to: {
      type: [Object, String] as PropType<RouteLocationRaw | string>,
    },
    params: {
      type: Object,
      default: () => ({}),
    },
    name: {
      type: String,
    },
    href: {
      type: String,
    },
    target: {
      type: String,
      default: '_blank',
    },
  });

  function routerLinkTo(route?: Record<string, any>) {
    if (isString(props.to)) return props.to;
    return {
      name: route?.name || props.name,
      params: route?.params || props.params,
      ...(props.to || {}),
    };
  }

  function validateUrlSecure() {
    const isInsecureUrl =
      props.href &&
      !props.allowInsecure &&
      !/^(https|mailto|tel):/.test(props.href);

    if (isInsecureUrl) {
      return console.warn(
        `Insecure <BaseLink> href: ${props.href}.\nWhen linking to external sites, always prefer https URLs. If this site does not offer SSL, explicitly add the allow-insecure attribute on <BaseLink>.`,
      );
    }
  }

  function validateUrlIsLocal() {
    const isLocalUrl = props.href && !/^\w+:/.test(props.href);

    if (isLocalUrl) {
      return console.warn(
        `Invalid <BaseLink> href: ${props.href}.\nIf you're trying to link to a local URL, provide at least a name or to`,
      );
    }
  }

  function validateRouterLinkProp() {
    const insufficientProp = !props.name && !props.to;

    if (insufficientProp) {
      return console.warn(
        `Invalid <BaseLink> props:\n\n${JSON.stringify(
          props,
          null,
          2,
        )}\n\nEither a \`name\` or \`to\` is required for internal links, or an \`href\` for external links.`,
      );
    }
  }

  // Perform more complex prop validations than is possible
  // inside individual validator functions for each prop.
  function validateProps() {
    if (props.href) {
      validateUrlSecure();
      validateUrlIsLocal();
    } else {
      // Check for insufficient props.
      validateRouterLinkProp();
    }
  }

  watchEffect(() => {
    validateProps();
  });

  onMounted(() => {
    validateProps();
  });
</script>

<template>
  <a
    v-if="!!props.href"
    :href="props.href"
    :target="props.target"
    v-bind="$attrs"
  >
    <slot />
  </a>
  <RouterLink v-else v-slot="scopedSlot" :to="routerLinkTo()" custom>
    <slot v-bind="scopedSlot"></slot>
  </RouterLink>
</template>
