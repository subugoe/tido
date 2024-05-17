<template>
  <div class="t-relative">
    <BaseDropdown
      v-model="showDropdown"
      :button-text="$t('change_language')"
    >
      <div
        v-for="lang in langs"
        :key="lang.value"
        :class="{ language: selectedLang === lang.value }"
        class="t-py-2 t-px-4 hover:t-bg-gray-200 dark:hover:t-bg-gray-600 t-rounded-md"
        @click="handleLanguageChange(lang)"
      >
        {{ lang.label }}
      </div>
    </BaseDropdown>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onMounted, ref, watch,
} from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import BaseDropdown from '@/components/base/BaseDropdown.vue';

interface Language {
  label: string,
  value: string
}

const store = useStore();
const { locale: i18nLocale } = useI18n();

const langs = ref<Language[]>([
  { label: 'DE', value: 'de-de' },
  { label: 'EN', value: 'en-US' },
]);
const selectedLang = ref<Language>(langs.value[0]);
const showDropdown = ref<boolean>(false);
const config = computed(() => store.getters['config/config']);

watch(
  selectedLang,
  (lang) => {
    i18nLocale.value = lang.value;
  },
);

onMounted(() => {
  selectedLang.value = config.value.lang || 'en-US';
});

function handleLanguageChange(lang: Language) {
  selectedLang.value = lang;
}
</script>