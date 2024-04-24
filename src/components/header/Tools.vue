<template>
  <div class="t-flex t-items-center no-wrap t-space-x-2 t-justify-end">
    <Language v-if="showLanguageSwitch" />
    <DarkModeToggle/>
    <SoftwareInfo />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import SoftwareInfo from '@/components/header/SoftwareInfo.vue';
import Language from '@/components/header/Language.vue';
import DarkModeToggle from '@/components/header/DarkModeToggle.vue';

const store = useStore();

const config = computed(() => store.getters['config/config']);
const showLanguageSwitch = computed(() => {
  console.log(config.value);
  return config.value?.header?.languageSwitch !== undefined
    ? config.value.header.languageSwitch
    : true;
});
</script>
