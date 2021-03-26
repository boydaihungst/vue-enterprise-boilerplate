<script>
  import appConfig from '@src/app.config';
  import Layout from '@layouts/main.vue';

  export default {
    metaInfo: {
      title: 'Home',
      meta: [{ name: 'description', content: appConfig.description }],
    },
    components: { Layout },
  };
</script>

<template>
  <Layout>
    <h1 class="">Home Page</h1>
    <img src="@assets/images/logo.png" alt="Logo" />
  </Layout>
</template>
