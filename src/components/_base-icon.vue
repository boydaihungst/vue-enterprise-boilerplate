<script lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { library as fontAwesomeIconLibrary } from '@fortawesome/fontawesome-svg-core';
  import camelCase from 'lodash/camelCase';
  import { defineComponent } from 'vue';
  import * as faSync from '@fortawesome/free-solid-svg-icons/faSync';
  import * as faUser from '@fortawesome/free-solid-svg-icons/faUser';

  // https://fontawesome.com/icons
  fontAwesomeIconLibrary.add(faSync.definition, faUser.definition);
  export default defineComponent({
    components: {
      FontAwesomeIcon,
    },
    inheritAttrs: false,
    props: {
      source: {
        type: String,
        default: 'font-awesome',
      },
      name: {
        type: String,
        required: true,
      },
    },
    computed: {
      // Gets a CSS module class, e.g. iconCustomLogo
      customIconClass(): string {
        return this.$style[camelCase('icon-custom-' + this.name)];
      },
    },
  });
</script>

<template>
  <FontAwesomeIcon
    v-if="source === 'font-awesome'"
    v-bind="$attrs"
    :icon="name"
  />
  <span
    v-else-if="source === 'custom'"
    v-bind="$attrs"
    :class="customIconClass"
  />
</template>
