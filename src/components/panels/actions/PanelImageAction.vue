<template>
  <div class="panel-image-action t-flex">
    <BaseButton
      v-for="(btn, idx) in buttons"
      display="flat"
      :id="btn.id"
      :key="idx"
      size="small"
      :title="$t(btn.tooltip)"
      :icon="btn.icon"
      class="t-text-primary t-basis-0"
    >
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseButton from '@/components/base/BaseButton.vue';

interface Button {
  id: string,
  icon: string,
  tooltip: string
}

const buttons = computed<Button[]>(() => ([
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
