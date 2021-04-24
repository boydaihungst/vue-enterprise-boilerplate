<script lang="ts">
  import Layout from '@layouts/layout.vue';
  import appConfig from '@src/app.config.json';
  import { defineComponent } from 'vue';
  import { useMeta } from 'vue-meta';
  import { authMethods } from '@state/helpers';

  export default defineComponent({
    components: { Layout },
    setup() {
      useMeta({
        title: 'Log in',
        description: `Log in to ${appConfig.title}`,
      });
      return {};
    },
    data() {
      return {
        username: '',
        password: '',
        authError: null,
        tryingToLogIn: false,
      };
    },
    computed: {
      placeholders() {
        return process.env.NODE_ENV === 'production'
          ? {}
          : {
              username: 'Use "admin" to log in with the mock API',
              password: 'Use "password123" to log in with the mock API',
            };
      },
    },
    methods: {
      ...authMethods,
      // Try to log the user in with the username
      // and password they provided.
      async tryToLogIn() {
        try {
          this.tryingToLogIn = true;
          // Reset the authError if it existed.
          this.authError = null;
          await this.logIn({
            username: this.username,
            password: this.password,
          });

          this.tryingToLogIn = false;

          // Redirect to the originally requested page, or to the home page
          this.$router.push(
            (this.$route.query.redirectFrom as string) || { name: 'home' }
          );
        } catch (error) {
          this.tryingToLogIn = false;
          this.authError = error;
        }
      },
    },
  });
</script>

<template>
  <Layout is="main" data-test="view-layout">
    <form :class="$style.form" @submit.prevent="tryToLogIn">
      <BaseInputText
        v-model="username"
        name="username"
        :placeholder="placeholders.username"
      />
      <BaseInputText
        v-model="password"
        name="password"
        type="password"
        :placeholder="placeholders.password"
      />
      <BaseButton :disabled="tryingToLogIn" type="submit">
        <BaseIcon v-if="tryingToLogIn" name="sync" spin />
        <span v-else>Log in</span>
      </BaseButton>
      <p v-if="authError">There was an error logging in to your account.</p>
    </form>
  </Layout>
</template>

<style lang="scss" module>
  @import '@design';

  .form {
    text-align: center;
  }
</style>
