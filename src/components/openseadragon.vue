<template>
  <div>
    <div style="margin: 16px;">
      <q-btn
        v-for="(btn, idx) in buttons" :key="idx"
        class="q-mr-sm q-mb-sm"
        color="grey-8"
        round
        flat
        size="md"
        :id="btn.id"
        >
        <q-icon size="sm" :name="btn.svg" />
      </q-btn>
    </div>
    <div>
      <figure id="openseadragon">
        <nav />
      </figure>
    </div>
  </div>
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
    imageurl: String,
  },
  data() {
    return {
      buttons: [
        { id: 'zoom-in', svg: fasSearchPlus },
        { id: 'zoom-out', svg: fasSearchMinus },
        { id: 'default', svg: fasExpand },
        { id: 'fullscreen', svg: fasExpandArrowsAlt },
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
    // eslint-disable-next-line no-unused-vars
    const viewer = new OpenSeadragon.Viewer(this.options);
    OpenSeadragon.setString('Tooltips.Home', 'Default View');
    OpenSeadragon.setString('Tooltips.FullPage', 'Toggle Fullscreen');

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

<style scoped>
  figure {
    height: 50vh;
    margin: 8px;
    overflow: hidden;
  }
</style>
