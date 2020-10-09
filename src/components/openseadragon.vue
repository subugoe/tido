<template>
  <figure id="openseadragon">
    <nav class="sticky">
      <q-btn
        v-for="(btn, idx) in buttons" :key="idx"
        class="q-mr-sm q-mb-sm"
        color="grey-8"
        flat
        round
        size="md"
        :id="btn.id"
        >
        <q-icon size="sm" :name="btn.svg" />
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
    const viewer = new OpenSeadragon.Viewer(this.options);
    viewer.controlsFadeDelay = 1000;

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

<style lang="scss" scoped>
figure {
  display: inline-block;
  height: 75vh;
  margin: 0;
  padding: 8px;
  width: 100%;
}
</style>
