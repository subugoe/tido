<template>
  <div
    class="panels-wrapper t-flex-1 t-space-y-4
    md:t-space-y-0 t-px-4 lg:t-px-6 t-pb-2 lg:t-pb-4 t-overflow-y-hidden lg:t-overflow-hidden"
  >
    <div
      ref="container"
      class="t-flex t-h-full t-overflow-x-auto t-pb-2 lg:t-pb-0 -t-mr-4 lg:t-mr-0"
    >
      <Panel
        v-for="(panel, i) in panels"
        v-show="panel.show"
        :key="`pc${i}`"
        :panel="panel"
        :active-view="getActiveView(i)"
        :default-width="defaultWidth"
        :class="{ 't-ml-4': i > 0 && !isMobile, 't-ml-2': i > 0 && isMobile, 't-mr-4': i === panels.length - 1 && isMobile }"
        @active-view="onActiveViewChange($event, i)"
      />
    </div>
  </div>
</template>

<script setup>

import {computed, onMounted, onUnmounted, ref, useTemplateRef, watch} from 'vue';
import { useConfigStore } from '@/stores/config';

import Panel from '@/components/panels/Panel.vue';
import { useResize } from "@/utils/resize.js";

const { isMobile, onResize } = useResize();

const configStore = useConfigStore();

const panelWrapperPadding = 32;
const panelMargin = 16;

const panels = computed(() => config.value.panels);
const config = computed(() => configStore.config);
const activeViews = computed(() => configStore.activeViews);
const container = useTemplateRef('container');
const defaultWidth = ref(300)

let unsubscribe;

const updatePanelWidth = (isMobile) => {
  if (container.value) {
    defaultWidth.value = isMobile ? container.value.clientWidth - panelWrapperPadding : container.value.clientWidth / panels.value.filter(({ show }) => !!(show)).length - panelMargin;
  }
  return 300;
}

onMounted(() => {
  // Call once on init
  updatePanelWidth(isMobile.value);

  // Call again after each window resize
  unsubscribe = onResize(updatePanelWidth);
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

watch(configStore.config, () => {
  updatePanelWidth(isMobile.value)
})

function onActiveViewChange(viewIndex, panelIndex) {
  configStore.setActivePanelView(viewIndex, panelIndex);
}

function getActiveView(panelIndex) {
  return activeViews.value[panelIndex];
}
</script>
