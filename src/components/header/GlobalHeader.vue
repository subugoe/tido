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
import { useStore } from 'vuex';
import Navbar from '@/components/header/Navbar.vue';
import TitleBar from '@/components/header/TitleBar.vue';
import PanelsToggle from '@/components/header/PanelsToggle.vue';
import Tools from '@/components/header/Tools.vue';


export interface Props {
  configErrorTitle: string
}

const props = withDefaults(defineProps<Props>(), {
  configErrorTitle: ''
})

const store = useStore();
const config = computed(() => store.getters['config/config']);
const show = computed<boolean | undefined>(() => config.value?.header?.show);
const manifests = computed<Manifest[]>(() => store.getters['contents/manifests']);
const item = computed<Item>(() => store.getters['contents/item']);
const showNavbar = computed<boolean>(() => config.value?.header?.navigation || true);
const showPanelsToggle = computed<boolean | undefined>(() => (config.value?.header?.panelsToggle !== undefined ? config.value?.header?.panelsToggle : true));
</script>
