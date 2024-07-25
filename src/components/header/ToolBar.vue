<template>
  <div class="t-flex t-items-center no-wrap t-space-x-2 t-justify-end">
    <LanguageSwitch v-if="showLanguageSwitch" />
    <DarkModeToggle />
    <SoftwareInfo />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useConfigStore } from '@/stores/config';
import SoftwareInfo from '@/components/header/SoftwareInfo.vue';
import LanguageSwitch from '@/components/header/LanguageSwitch.vue';
import DarkModeToggle from '@/components/header/DarkModeToggle.vue';

const configStore = useConfigStore();

const config = computed(() => configStore.config);
const showLanguageSwitch = computed(() => (config.value?.header?.languageSwitch !== undefined
  ? config.value.header.languageSwitch
  : true));
</script>
