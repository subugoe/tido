<template>
  <div class="t-flex no-wrap t-space-x-2 t-justify-end">
    <Language v-if="showLanguageSwitch" />
    <BaseButton
      display="flat"
      rounded
      size="normal"
      class="dark:t-text-yellow-400 t-text-gray-400"
      :icon="isDark ? 'moon' : 'sun'"
      @click="toggleDark()"
    ></BaseButton>
    <SoftwareInfo />
  </div>
</template>

<script setup>

import { computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useToggle } from '@vueuse/core';
import { isDark } from '@/utils/is-dark';
import SoftwareInfo from '@/components/header/SoftwareInfo.vue';
import Language from '@/components/header/Language.vue';
import BaseButton from '@/components/base/BaseButton.vue';

const store = useStore();

const toggleDark = useToggle(isDark);

const config = computed(() => store.getters['config/config']);
const showLanguageSwitch = computed(() => (
  config.value?.header?.languageSwitch !== undefined
    ? config.value.header.languageSwitch
    : true
));
</script>
