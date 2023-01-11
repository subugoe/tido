<template>
  <div class="panel-image-action flex items-center justify-end">
    <q-btn
      v-for="(btn, idx) in buttons"
      :id="btn.id"
      :key="idx"
      flat
      round
      size="sm"
      :color="$q.dark.isActive ? 'white' : 'primary'"
      :title="$t(btn.tooltip)"
      :icon="btn.icon"
    >
    </q-btn>
  </div>
</template>

<script>
import {
  biZoomIn, biZoomOut, biFullscreen, biArrowsFullscreen,
} from '@quasar/extras/bootstrap-icons';

export default {
  name: 'PanelImageAction',
  data() {
    return {
      buttons: [
        { id: 'zoom-in', icon: biZoomIn, tooltip: 'zoom_in' },
        { id: 'zoom-out', icon: biZoomOut, tooltip: 'zoom_out' },
        { id: 'fullscreen', icon: biFullscreen, tooltip: 'switch_to_fullscreen' },
        { id: 'default', icon: biArrowsFullscreen, tooltip: 'reset_view' },
      ],
    };
  },
};
</script>

<style scoped>
.q-btn {
  display: inherit !important;
  flex-basis: 0%;
}
.panel-image-action {
  margin-right: -6px;
}
</style>
