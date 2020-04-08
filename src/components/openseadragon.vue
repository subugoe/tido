<template>
  <figure id="openseadragon" style="height: 100vh; overflow: hidden;">
    <nav>
      <button style="margin-left: 8px; margin-top: 8px;"
        v-for="(btn, idx) in buttons" :key="idx"
        class="image__interact-button"
        :id="btn.id"
        v-html="btn.svg"
        >
      </button>
    </nav>
  </figure>
</template>

<script>
import OpenSeadragon from 'openseadragon';

export default {
  name: 'OpenSeadragon',
  props: {
    imageurl: String,
    vectors: Object,
  },
  data() {
    return {
      buttons: [
        { id: 'zoom-in', svg: this.vectors['search-plus'] },
        { id: 'zoom-out', svg: this.vectors['search-minus'] },
        { id: 'default', svg: this.vectors.expand },
        { id: 'fullscreen', svg: this.vectors['expand-alt'] },
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
  },
};
</script>
