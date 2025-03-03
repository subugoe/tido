<template>
  <div
    v-if="show"
    class="header t-flex t-flex-col t-mb-4"
  >
    <div class="t-flex t-items-start sm:t-flex-row t-flex-col-reverse">
      <TitleBar :item="item" />
      <ToolBar class="t-ml-auto" />
    </div>
    <div
      v-if="item"
      class="t-flex md:t-items-center t-flex-col md:t-flex-row"
    >
      <NavBar v-if="showNavbar" />
      <PanelsToggle
        v-if="showPanelsToggle"
        class="md:t-ml-auto t-mt-4 md:t-mt-0"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useContentsStore } from '@/stores/contents';
import NavBar from '@/components/header/NavBar.vue';
import TitleBar from '@/components/header/TitleBar.vue';
import PanelsToggle from '@/components/header/PanelsToggle.vue';
import ToolBar from '@/components/header/ToolBar.vue';

export interface Props {
  configErrorTitle: string
}

withDefaults(defineProps<Props>(), {
  configErrorTitle: '',
});

const configStore = useConfigStore();
const conntentStore = useContentsStore();

const config = computed(() => configStore.config);
const show = computed<boolean | undefined>(() => config.value?.header?.show);
const item = computed<Item>(() => conntentStore.item);
const showNavbar = computed<boolean>(() => config.value?.header?.navigation || true);
const showPanelsToggle = computed<boolean | undefined>(() => (config.value?.header?.panelsToggle !== undefined ? config.value?.header?.panelsToggle : true));
</script>
