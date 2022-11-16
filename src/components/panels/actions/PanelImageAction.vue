<template>
  <div class="t-flex items-center">
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
export default {
  name: 'PanelImageAction',
  data() {
    return {
      buttons: [
        { id: 'zoom-in', icon: 'bi-zoom-in', tooltip: 'zoom_in' },
        { id: 'zoom-out', icon: 'bi-zoom-out', tooltip: 'zoom_out' },
        { id: 'fullscreen', icon: 'bi-fullscreen', tooltip: 'switch_to_fullscreen' },
        { id: 'default', icon: 'bi-arrows-fullscreen', tooltip: 'reset_view' },
      ],
    };
  },
};
</script>

<style scoped>
.q-btn {
  display: inherit !important;
}
</style>
