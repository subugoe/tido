<template>
  <div class="flex no-wrap justify-end">
    <Language v-if="showLanguageSwitch" />
    <BaseButton
      display="flat"
      rounded
      class="dark:t-text-yellow-400 t-text-gray-600"
      :icon="isDark ? 'moon' : 'sun'"
      @click="toggleDark"
    ></BaseButton>
    <SoftwareInfo />
  </div>
</template>

<script setup>

import { computed } from 'vue';
import { useStore } from 'vuex';
import { useDark, useToggle } from '@vueuse/core';
import SoftwareInfo from '@/components/header/SoftwareInfo.vue';
import Language from '@/components/header/Language.vue';
import BaseButton from '@/components/base/BaseButton.vue';

const store = useStore();

const isDark = useDark();
const toggleDark = useToggle(isDark);

const config = computed(() => store.getters['config/config']);
const showLanguageSwitch = computed(() => (
  config.value?.header?.languageSwitch !== undefined
    ? config.value.header.languageSwitch
    : true
));
</script>
