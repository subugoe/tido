<template>
  <div
    v-if="show"
    class="header t-flex t-flex-col t-p-4 lg:t-px-6 t-mb-4"
  >
    <div class="t-flex t-items-start sm:t-flex-row t-flex-col-reverse t-mt-2">
      <TitleBar :item="item"/>
      <div class="t-ml-auto">
        <Tools/>
      </div>
    </div>
    <div v-if="item" class="t-flex t-items-center">
      <Navbar v-if="showNavbar"/>
      <PanelsToggle v-if="showPanelsToggle" class="sm:t-ml-auto t-mt-4 md:t-mt-0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useContentsStore } from '@/stores/contents';
import Navbar from '@/components/header/Navbar.vue';
import TitleBar from '@/components/header/TitleBar.vue';
import PanelsToggle from '@/components/header/PanelsToggle.vue';
import Tools from '@/components/header/Tools.vue';

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
