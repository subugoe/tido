<template>
  <div class="imageItem">
    <Loading v-if="isLoading" />
    <div v-if="error" class="q-pa-sm">
      <Notification :message="$t(error.message)" title-key="no_image_available" type="warning" />
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
          <q-icon :id="btn.id" size="xs" :name="btn.svg"/>
        </q-btn>
      </nav>
    </div>
    <figure id="openseadragon" class="item"></figure>
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
        { id: 'zoom-in', svg: fasSearchPlus, tooltip: 'zoom_in' },
        { id: 'zoom-out', svg: fasSearchMinus, tooltip: 'zoom_out' },
        { id: 'default', svg: fasExpand, tooltip: 'reset_view' },
        { id: 'fullscreen', svg: fasExpandArrowsAlt, tooltip: 'switch_to_fullscreen' },
      ],
      error: null,
      isLoading: false
    };
  },
  computed: {
    item() {
      return this.$store.getters['contents/item'];
    },
    imageUrl() {
      return this.item.image?.id;
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
    item: {
      async handler() {
        console.log('item ------------', this.item);
        this.isLoading = true;
        try {
          const response = await fetch(this.item.image.id);

          if (response.status === 500) throw { message: 'error_image_not_exists'};

          if (response.status !== 200 || response.status !== 201) throw { message: 'error_vpn'};

          this.error = null;
          this.initOpenSeagragon();

        } catch (error) {
          console.log(error.message);
          this.error = error;
          this.isLoading = false;
        }
      },
      immediate: true,
    },
  },
  mounted() {
    console.log('image mounted');
  },
  beforeUnmount() {
    document.removeEventListener('fullscreenchange', this.onFullscreenChange);
  },
  methods: {
    initOpenSeagragon() {
      if (this.viewer) {
        this.viewer.destroy();
        this.viewer = null;
      }

      this.viewer = new OpenSeadragon.Viewer(this.options);
      this.viewer.controlsFadeDelay = 1000;

      this.viewer.addHandler('tile-loaded', () => {
        this.isLoading = false;
      });

      document.addEventListener('fullscreenchange', this.onFullscreenChange);
    },
    onFullscreenChange() {
      Object.values(this.buttons).forEach((v) => {
        if (v.id === 'fullscreen') {
          v.svg = document.fullscreenElement !== null
            ? fasCompressArrowsAlt
            : fasExpandArrowsAlt;
        }
      });
    }
  }
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
