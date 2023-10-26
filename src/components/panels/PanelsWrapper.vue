<template>
  <div class="panels-target q-gutter-md-md q-px-md q-px-lg-lg q-pb-md-md">
    <div v-for="(panel, i) in panels" v-show="panel.show" :key="`pc${i}`" class="item q-pb-md q-pb-md-none">
      <Panel :panel="panel" :active-view="getActiveView(i)" @active-view="onActiveViewChange($event, i)" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PanelsWrapper',
}
</script>

<script setup>
import Panel from '@/components/panels/Panel.vue';

import { computed } from 'vue';
import { useStore } from 'vuex';

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

<style lang="scss" scoped>
.content-tabs {
  display: inline-block;
}

.panels-target {
  display: flex;
  flex: 1;
  @media (max-width: $breakpoint-sm-max) {
    flex-direction: column;
  }
}

.item {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  @media (max-width: $breakpoint-sm-max) {
    max-height: 66vh;
  }
}

.tabs-container {
  display: flex;

  > * {
    flex: 1;
  }
}
</style>
