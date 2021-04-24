<script lang="ts">
  import { defineComponent } from 'vue';
  import { useMeta } from 'vue-meta';
  import Layout from '@layouts/layout.vue';
  import appConfig from '@src/app.config.json';

  export default defineComponent({
    components: {
      Layout,
    },
    setup() {
      useMeta({
        // Can be static or computed
        title: 'Home',
        description: appConfig.description,
      });
      return {};
    },
  });
</script>

<template>
  <Layout is="main" data-test="view-layout">
    <h1>Home Page</h1>
    <img src="@assets/images/logo.png" alt="Logo" />
  </Layout>
</template>
