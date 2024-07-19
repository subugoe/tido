<template>
  <div class="panels-wrapper t-flex t-flex-col md:t-overflow-auto t-flex-1 md:t-flex-row md:t-space-x-4 t-space-y-4 md:t-space-y-0 t-px-4 lg:t-px-6 md:t-pb-4">
    <Panel
      v-for="(panel, i) in panels"
      v-show="panel.show"
      :key="`pc${i}`"
      :panel="panel"
      :active-view="getActiveView(i)"
      class="t-flex-1 t-h-screen md:t-h-auto"
      @active-view="onActiveViewChange($event, i)"
    />
  </div>
</template>

<script setup>

import { computed } from 'vue';
import { useConfigStore } from '@/stores/config';

import Panel from '@/components/panels/Panel.vue';

const configStore = useConfigStore();

const panels = computed(() => config.value.panels);
const config = computed(() => configStore.config);
const activeViews = computed(() => configStore.activeViews);

function onActiveViewChange(viewIndex, panelIndex) {
  configStore.setActivePanelView(viewIndex, panelIndex);
}

function getActiveView(panelIndex) {
  return activeViews.value[panelIndex];
}
</script>
