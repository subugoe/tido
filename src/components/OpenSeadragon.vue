<template>
  <div
    v-if="errorImage"
    class="q-pa-sm"
  >
    <Notification
      :message="$t(errorImage.messageKey)"
      title-key="imageErrorTitle"
      type="warning"
    />
  </div>
  <figure
    v-else
    id="openseadragon"
    class="item"
  >
    <nav>
      <q-btn
        v-for="(btn, idx) in buttons"
        :id="$t(btn.tooltip)"
        :key="idx"
        flat
        round
        size="sm"
        :color="$q.dark.isActive ? 'white' : 'accent'"
        class="q-ml-xs q-mt-xs"
        :title="$t(btn.tooltip)"
      >
        <q-icon
          :id="btn.id"
          size="xs"
          :name="btn.svg"
        />
      </q-btn>
    </nav>
  </figure>
</template>

<script>
import OpenSeadragon from 'openseadragon';
import {
  fasSearchPlus,
  fasSearchMinus,
  fasExpand,
  fasExpandArrowsAlt,
  fasCompressArrowsAlt,
} from '@quasar/extras/fontawesome-v5';

import Notification from '@/components/Notification.vue';

export default {
  name: 'OpenSeadragon',
  components: {
    Notification,
  },
  data() {
    return {
      buttons: [
        { id: 'zoom-in', svg: fasSearchPlus, tooltip: 'osdZoomin' },
        { id: 'zoom-out', svg: fasSearchMinus, tooltip: 'osdZoomout' },
        { id: 'default', svg: fasExpand, tooltip: 'osdHome' },
        { id: 'fullscreen', svg: fasExpandArrowsAlt, tooltip: 'osdFullPage' },
      ],
    };
  },
  computed: {
    imageUrl() {
      return this.$store.getters['contents/imageUrl'];
    },
    errorImage() {
      return this.$store.getters['contents/errorImage'];
    },
    options() {
      return {
        id: 'openseadragon',
        tileSources: {
          type: 'image',
          url: this.imageUrl,
        },
        maxZoomLevel: 10,
        zoomInButton: 'zoom-in',
        zoomOutButton: 'zoom-out',
        homeButton: 'default',
        fullPageButton: 'fullscreen',
      };
    },
  },
  mounted() {
    if (this.errorImage) {
      return;
    }

    const viewer = new OpenSeadragon.Viewer(this.options);
    viewer.controlsFadeDelay = 1000;

    document.addEventListener('fullscreenchange', () => {
      Object.values(this.buttons).forEach((v) => {
        if (v.id === 'fullscreen') {
          v.svg = document.fullscreenElement !== null
            ? fasCompressArrowsAlt
            : fasExpandArrowsAlt;
        }
      });
    });
  },
};
</script>

<style lang="scss" scoped>
figure {
  display: inline-block;
  height: 75vh;
  margin: 0;
  width: 100%;
}
</style>
