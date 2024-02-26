<template>
  <div class="image-view t-relative t-flex t-h-full">
    <div v-if="error" class="t-p-2 t-flex t-justify-center t-pt-12">
      <Notification :message="$t(error.message)" :title="$t('no_image_available')" type="warning" />
    </div>
    <figure v-else id="openseadragon" class="t-flex-1 t-margin-0"></figure>
  </div>
</template>

<script setup>
import OpenSeadragon from 'openseadragon';

import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import Notification from '@/components/Notification.vue';
import { delay } from '@/utils';

const emit = defineEmits('loading');

const store = useStore();

const viewer = ref(null);
const error = ref(null);

const item = computed(() => store.getters['contents/item']);
const imageUrl = computed(() => item.value?.image?.id);
const options = computed(() => ({
  id: 'openseadragon',
  tileSources: {
    type: 'image',
    url: imageUrl.value,
  },
  maxZoomLevel: 10,
  zoomInButton: 'zoom-in',
  zoomOutButton: 'zoom-out',
  homeButton: 'default',
  fullPageButton: 'fullscreen',
}));

watch(
  item,
  async () => {
    if (!item.value?.image) {
      error.value = { message: 'no_image_available' };
      return;
    }
    emit('loading', true);
    try {
      const response = await fetch(item.value.image.id);

      if (response.status === 500) throw { message: 'error_image_not_exists' };

      if (response.status !== 200 && response.status !== 201) throw { message: 'error_vpn' };

      error.value = null;
      await delay(1000);
      initOpenSeagragon();
    } catch (e) {
      error.value = e;
      emit('loading', false);
    }
  },
  { immediate: true },
);

function initOpenSeagragon() {
  if (viewer.value) {
    viewer.value.destroy();
    viewer.value = null;
  }

  viewer.value = new OpenSeadragon.Viewer(options.value);
  viewer.value.controlsFadeDelay = 1000;

  viewer.value.addHandler('tile-loaded', () => {
    emit('loading', false);
  });

  viewer.value.addHandler('open-failed', () => {
    error.value = { message: 'error_open_image' };
    emit('loading', false);
  });
}
</script>

<style lang="scss" scoped>
//figure {
//  display: inline-block;
//  height: 75vh;
//  margin: 0;
//  width: 100%;
//}
</style>
