<script lang="ts">
  import { defineComponent } from 'vue';
  import axios from 'axios';
  import Layout from '@layouts/layout.vue';
  import { useMeta } from 'vue-meta';
  import LoadingView from './_loading.vue';

  export default defineComponent({
    components: { Layout, LoadingView },
    setup() {
      useMeta({
        // Can be static or computed
        title: 'Loading timeout',
        description: 'The page timed out while loading.',
      });
    },
    data() {
      return {
        offlineConfirmed: false,
      };
    },
    beforeCreate() {
      axios
        .head('/api/ping')
        .then(() => {
          window.location.reload();
        })
        .catch(() => {
          this.offlineConfirmed = true;
        });
    },
  });
</script>

<template>
  <Layout is="main" v-if="offlineConfirmed" data-test="view-layout">
    <h1 :class="$style.title">
      The page timed out while loading. Are you sure you're still connected to
      the Internet?
    </h1>
  </Layout>
  <LoadingView v-else />
</template>

<style lang="scss" module>
  .title {
    text-align: center;
  }
</style>
