<script lang="ts" setup>
  import { useLayout } from '@composables/layout';
  import { faSync } from '@fortawesome/free-solid-svg-icons';
  import { useAuthStore } from '@stores';
  import { useHead } from '@unhead/vue';
  import { computed, reactive, ref, unref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  const authStore = useAuthStore();
  const { setLayout } = useLayout();

  const { t } = useI18n();
  const router = useRouter();
  const route = useRoute();

  setLayout('Default');
  useHead({
    title: t('views.login.meta.title'),
    meta: [
      {
        name: 'description',
        content: t('views.login.meta.description'),
      },
    ],
  });
  const credential = reactive({
    username: '',
    password: '',
  });
  const authError = ref<Error | null>(null);
  const tryingToLogIn = ref(false);
  const placeholders = computed(() => {
    if (!import.meta.env.PROD) {
      return {
        username: t('views.login.usernameHint'),
        password: t('views.login.passwordHint'),
      };
    }
    return {};
  });

  async function tryToLogIn() {
    try {
      tryingToLogIn.value = true;
      // Reset the authError if it existed.
      authError.value = null;
      await authStore.logIn({
        username: unref(credential.username),
        password: unref(credential.password),
      });

      tryingToLogIn.value = false;

      // Redirect to the originally requested page, or to the home page
      router.push((route.query.redirectFrom as string) || { name: 'home' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        tryingToLogIn.value = false;
        authError.value = error;
      }
    }
  }
</script>

<template>
  <form :class="$style.form" @submit.prevent="tryToLogIn">
    <BaseInputText
      v-model="credential.username"
      name="username"
      :placeholder="placeholders.username"
    />
    <BaseInputText
      v-model="credential.password"
      name="password"
      type="password"
      :placeholder="placeholders.password"
    />
    <BaseButton :disabled="tryingToLogIn" type="submit">
      <BaseIcon v-if="tryingToLogIn" :icon="faSync" spin />
      <span v-else>{{ t('views.login.loginButton') }}</span>
    </BaseButton>
    <p v-if="authError">{{ t('views.login.unauthorizedError') }}</p>
  </form>
</template>

<style lang="scss" module>
  @import '@design';

  .form {
    text-align: center;
  }
</style>
