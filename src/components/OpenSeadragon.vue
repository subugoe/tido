<template>
  <div class="imageItem">
    <Loading v-if="loadingImage" />
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
    <div v-else>
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
    </div>
    <figure
      id="openseadragon"
      class="item"
    >
    </figure>
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

import Loading from '@/components/Loading.vue';
import Notification from '@/components/Notification.vue';

export default {
  name: 'OpenSeadragon',
  components: {
    Loading,
    Notification,
  },
  data() {
    return {
      viewer: null,
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
    itemUrl() {
      return this.$store.getters['contents/itemUrl'];
    },
    errorImage() {
      return this.$store.getters['contents/errorImage'];
    },
    loadingImage() {
      return this.$store.getters['contents/loadingImage'];
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
  watch: {
    itemUrl: {
      handler: 'onItemUrlChange',
      immediate: true,
    },
  },
  methods: {
    async onItemUrlChange(itemUrl) {
      console.log('onItemUrlChange');

      await this.getImageItemData(itemUrl);
      this.init();
    },
    async getImageItemData(itemUrl) {
      await this.$store.dispatch('contents/initImageData', itemUrl);
    },
    init() {
      if (this.errorImage) {
        return;
      }

      if (this.viewer) {
        this.viewer.destroy();
        this.viewer = null;
      }

      this.viewer = new OpenSeadragon.Viewer(this.options);
      this.viewer.controlsFadeDelay = 1000;

      this.viewer.addHandler('tile-loaded', () => {
        this.$store.dispatch('contents/updateImageLoading', true);
      });

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

.imageItem{
  position: relative;
}
</style>
