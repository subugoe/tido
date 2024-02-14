<template>
  <div class="panels-wrapper t-flex t-flex-col t-flex-1 t-overflow-auto sm:t-flex-row t-space-x-4 t-px-4 lg:t-px-6 md:t-pb-4">
    <Panel
      v-for="(panel, i) in panels"
      v-show="panel.show"
      :key="`pc${i}`"
      :panel="panel"
      :active-view="getActiveView(i)"
      @active-view="onActiveViewChange($event, i)"
      class="t-flex-1"
    />
  </div>
</template>

<script setup>

import { computed } from 'vue';
import { useStore } from 'vuex';
import Panel from '@/components/panels/Panel.vue';

const store = useStore();

const panels = computed(() => {
  const { panels } = config.value;
  return panels;
});
const config = computed(() => store.getters['config/config']);
const activeViews = computed(() => store.getters['config/activeViews']);

function onActiveViewChange(viewIndex, panelIndex) {
  store.dispatch('config/setActivePanelView', { viewIndex, panelIndex });
}

function getActiveView(panelIndex) {
  return activeViews.value[panelIndex];
}
</script>
