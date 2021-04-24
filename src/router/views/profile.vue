<script lang="ts">
  import { defineComponent, toRefs, PropType } from 'vue';
  import Layout from '@layouts/layout.vue';
  import { useMeta } from 'vue-meta';
  import { User } from '@models/user';

  export default defineComponent({
    components: { Layout },
    props: {
      user: {
        type: Object as PropType<User>,
        required: true,
      },
    },
    setup(props) {
      const { user } = toRefs(props);
      useMeta({
        // Can be static or computed
        title: user.value.name,
        description: `The user profile for ${user.value.name}`,
      });
    },
  });
</script>

<template>
  <Layout is="main" data-test="view-layout">
    <h1>
      <BaseIcon name="user" />
      {{ user.name }} Profile
    </h1>
    <pre>{{ user }}</pre>
  </Layout>
</template>
