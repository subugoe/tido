<template>
  <div class="flex no-wrap justify-end">
    <Language v-if="showLanguageSwitch" />
    <q-btn
      flat
      round
      :color="$q.dark.isActive ? 'yellow-4': 'grey-6'"
      :icon="$q.dark.isActive ? darkIcon: lightIcon"
      @click="$q.dark.toggle()"
    ></q-btn>
    <SoftwareInfo />
  </div>
</template>

<script setup>

import { computed } from 'vue';
import { useStore } from 'vuex';
import { biMoonFill, biSunFill } from '@quasar/extras/bootstrap-icons';
import SoftwareInfo from '@/components/header/SoftwareInfo.vue';
import Language from '@/components/header/Language.vue';

const store = useStore();
const darkIcon = biMoonFill;
const lightIcon = biSunFill;

const config = computed(() => store.getters['config/config']);
const showLanguageSwitch = computed(() => (
  config.value?.header?.languageSwitch !== undefined
    ? config.value.header.languageSwitch
    : true
));
</script>
