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
import { biMoonFill, biSunFill } from '@quasar/extras/bootstrap-icons';
import { computed, onBeforeMount, ref } from 'vue';
import { useStore } from 'vuex';
import Language from '@/components/header/Language.vue';
import SoftwareInfo from '@/components/header/SoftwareInfo.vue';

const store = useStore();

const darkIcon = ref(null);
const lightIcon = ref(null);

const config = computed(() => store.getters['config/config']);

const showLanguageSwitch = computed(() => (config.value.header?.languageSwitch !== undefined ? config.value.header?.languageSwitch : true));

onBeforeMount(() => {
  darkIcon.value = biMoonFill;
  lightIcon.value = biSunFill;
});
</script>
