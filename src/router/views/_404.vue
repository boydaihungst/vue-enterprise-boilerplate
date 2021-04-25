<script lang="ts">
  import { defineComponent } from 'vue';
  import Layout from '@layouts/layout.vue';
  import { useMeta } from 'vue-meta';

  export default defineComponent({
    components: {
      Layout,
    },
    props: {
      resource: {
        type: String,
        default: '',
      },
    },
    setup() {
      useMeta({
        // Can be static or computed
        title: '404',
        description: '404',
      });
    },
  });
</script>

<template>
  <Layout is="default" data-test="view-layout">
    <h1 :class="$style.title">
      404
      <template v-if="resource">
        {{ resource }}
      </template>
      Not Found
    </h1>
  </Layout>
</template>

<style lang="scss" module>
  .title {
    text-align: center;
  }
</style>
