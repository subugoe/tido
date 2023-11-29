<template>
  <div
    class="header q-pa-md q-px-lg-lg"
    :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-3'"
    v-if="show"
  >
    <div class="flex items-start title-container">
      <TitleBar :item="item"/>
      <div class="q-ml-auto">
        <Tools/>
      </div>
    </div>
    <div v-if="item" class="flex column-xs row-md">
      <Navbar v-if="showNavbar"/>
      <PanelsToggle v-if="showPanelsToggle" class="flex justify-sm-end col q-mt-md q-mt-md-none" />
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/header/Navbar.vue';
import TitleBar from '@/components/header/TitleBar.vue';
import PanelsToggle from '@/components/header/PanelsToggle.vue';
import Tools from '@/components/header/Tools.vue';

import { computed } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
  configErrorTitle: {
    type: String,
    default: () => '',
  },
});

const store = useStore();

const show = computed(() => config.value?.header?.show);
const manifests = computed(() => store.getters['contents/manifests']);
const config = computed(() => store.getters['config/config']);
const item = computed(() => store.getters['contents/item']);
const showNavbar = computed(() => config.value?.header?.navigation || true);
const showPanelsToggle = computed(() => config.value?.header?.panelsToggle !== undefined ? config.value?.header?.panelsToggle : true);
</script>

<style lang="scss" scoped>
.title-container {
  @media (max-width: $breakpoint-sm-max) {
    flex-direction: column-reverse;
  }
}
</style>
