<template>
  <div
    class="panels-wrapper t-flex-1 t-space-y-4
    md:t-space-y-0 t-overflow-hidden"
  >
    <div
      ref="container"
      class="t-flex t-h-full t-overflow-x-auto t-pb-2 -t-mr-4 lg:t-mr-0 t-gap-4"
    >
      <Panel
        v-for="(panel, i) in panels"
        v-show="panel.show"
        :key="`pc${i}`"
        :panel="panel"
        :panel-index="i"
        :active-view="getActiveView(i)"
        class="panel"
        :class="{
          't-mr-4': i === panels.length - 1 && isMobile
        }"
        @active-view="onActiveViewChange($event, i)"
      />
    </div>
  </div>
</template>

<script setup>
import { useResize } from "@/utils/resize.js";

const { isMobile } = useResize();

import { computed, useTemplateRef } from 'vue';
import { useConfigStore } from '@/stores/config';

import Panel from '@/components/panels/Panel.vue';

const configStore = useConfigStore();

const panels = computed(() => config.value.panels);
const config = computed(() => configStore.config);
const activeViews = computed(() => configStore.activeViews);
const container = useTemplateRef('container');


function onActiveViewChange(viewIndex, panelIndex) {
  configStore.setActivePanelView(viewIndex, panelIndex);
}

function getActiveView(panelIndex) {
  return activeViews.value[panelIndex];
}
</script>
