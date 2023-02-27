<script lang="ts" setup>
  import { useLayout } from '@composables/layout';
  import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
  import type { User } from '@models/user';
  import { IconSource } from '@src/constraint/const';
  import { useHead } from '@unhead/vue';
  import { toRefs, type PropType } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { setLayout } = useLayout();
  const { t } = useI18n();
  const props = defineProps({
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  });
  const { user } = toRefs(props);

  setLayout('Default');
  useHead({
    title: user.value.name,
    meta: [
      {
        name: 'description',
        content: t('views.profile.meta.description', {
          username: user.value.name,
        }),
      },
    ],
  });
</script>

<template>
  <h1>
    <BaseIcon :icon="faUser" :source="IconSource.AWESOME_FONT" />
    {{ t('views.profile.header', { username: user.name }) }}
  </h1>
  <pre>{{ user }}</pre>
</template>
