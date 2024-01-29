<template>
  <div class="panel-image-action t-flex t-items-center t-justify-end t-space-x-1">
    <BaseButton
      v-for="(btn, idx) in buttons"
      display="flat"
      :id="btn.id"
      :key="idx"
      :rounded="true"
      size="small"
      :title="$t(btn.tooltip)"
      :icon="btn.icon"
      class="t-py-[0.3rem] t-px-2"
    >
    </BaseButton>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BaseButton from '@/components/base/BaseButton.vue';

const buttons = computed(() => ([
  { id: 'zoom-in', icon: 'zoomIn', tooltip: 'zoom_in' },
  { id: 'zoom-out', icon: 'zoomOut', tooltip: 'zoom_out' },
  { id: 'fullscreen', icon: 'fullscreen', tooltip: 'switch_to_fullscreen' },
  { id: 'default', icon: 'exitFullscreen', tooltip: 'reset_view' },
]));
</script>

<style scoped>
.panel-image-action {
  margin-right: -6px;
}
</style>
