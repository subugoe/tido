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

<script setup>
import {
  computed, onMounted, ref, watch,
} from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import BaseDropdown from '@/components/base/BaseDropdown.vue';

const store = useStore();
const { locale: i18nLocale } = useI18n();

const langs = ref([
  { label: 'DE', value: 'de-de' },
  { label: 'EN', value: 'en-US' },
]);
const selectedLang = ref(langs.value[0]);
const showDropdown = ref(false);
const config = computed(() => store.getters['config/config']);

watch(
  selectedLang,
  (lang) => {
    i18nLocale.value = lang;
  },
);

onMounted(() => {
  selectedLang.value = config.value.lang || 'en-US';
});

function handleLanguageChange(lang) {
  selectedLang.value = lang.value;
}
</script>
