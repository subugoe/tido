<template>
  <div class="imageItem">
    <div v-if="error" class="q-pa-sm">
      <Notification :message="$t(error.message)" title-key="no_image_available" type="warning" />
    </div>
    <figure v-else id="openseadragon" class="item"></figure>
  </div>
</template>

<script>
import OpenSeadragon from 'openseadragon';
import { delay } from '@/utils';
import Notification from '@/components/Notification.vue';

export default {
  name: 'OpenSeadragon',
  components: {
    Notification,
  },
  data() {
    return {
      viewer: null,
      error: null,
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
        if (!this.item.image) {
          this.error = { message: 'no_image_available' };
          return;
        }
        this.$emit('loading', true);
        try {
          const response = await fetch(this.item.image.id);

          if (response.status === 500) throw { message: 'error_image_not_exists' };

          if (response.status !== 200 && response.status !== 201) throw { message: 'error_vpn' };

          this.error = null;
          await delay(1000);
          this.initOpenSeagragon();
        } catch (error) {
          this.error = error;
          this.$emit('loading', false);
        }
      },
      immediate: true,
    },
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
        this.$emit('loading', false);
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
