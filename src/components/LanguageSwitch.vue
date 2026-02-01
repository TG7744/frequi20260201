<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const settingsStore = useSettingsStore();
const { t } = useI18n();

const locale = computed({
  get: () => settingsStore.locale,
  set: (value: 'en' | 'zh') => {
    settingsStore.setLocale(value);
  },
});

const localeOptions = computed(() => [
  { label: t('language.zh'), value: 'zh' },
  { label: t('language.en'), value: 'en' },
]);
</script>

<template>
  <Select
    v-model="locale"
    size="small"
    class="min-w-28"
    option-label="label"
    option-value="value"
    :options="localeOptions"
    :aria-label="t('language.select')"
  />
</template>
