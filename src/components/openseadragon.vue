<template>
  <figure id="openseadragon">
    <nav class="sticky">
      <q-btn
        v-for="(btn, idx) in buttons"
        :id="btn.id"
        :key="idx"
        class="q-mr-sm q-mb-sm"
        flat
        round
        size="md"
        :color="$q.dark.isActive ? 'white' : 'accent'"
        :title="$t(btn.tooltip)"
      >
        <q-icon
          size="sm"
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

export default {
  name: 'OpenSeadragon',
  props: {
    imageurl: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      buttons: [
        { id: 'zoom-in', svg: fasSearchPlus, tooltip: 'OSD_Zoomin' },
        { id: 'zoom-out', svg: fasSearchMinus, tooltip: 'OSD_Zoomout' },
        { id: 'default', svg: fasExpand, tooltip: 'OSD_Home' },
        { id: 'fullscreen', svg: fasExpandArrowsAlt, tooltip: 'OSD_FullPage' },
      ],
      options: {
        id: 'openseadragon',
        tileSources: {
          type: 'image',
          url: this.imageurl,
        },
        maxZoomLevel: 10,
        zoomInButton: 'zoom-in',
        zoomOutButton: 'zoom-out',
        homeButton: 'default',
        fullPageButton: 'fullscreen',
      },
    };
  },
  mounted() {
    const viewer = new OpenSeadragon.Viewer(this.options);
    viewer.controlsFadeDelay = 1000;

    document.addEventListener('fullscreenchange', () => {
      Object.values(this.buttons).forEach((v) => {
        if (v.id === 'fullscreen') {
          v.svg = document.fullscreenElement !== null ? fasCompressArrowsAlt : fasExpandArrowsAlt;
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
