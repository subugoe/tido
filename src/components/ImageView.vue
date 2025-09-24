<template>
  <div class="image-view t-relative t-h-full">
    <div
      v-if="error"
      class="t-p-2 t-flex t-justify-center t-pt-12"
    >
      <MessageBox
        :message="$t(error.message)"
        :title="$t('no_image_available')"
        type="warning"
      />
    </div>
    <figure
      v-else
      id="openseadragon"
      class="t-w-full t-h-full t-margin-0"
    />
  </div>
</template>

<script setup>
import OpenSeadragon from 'openseadragon';
import SVGOverlay from "@/utils/openseadragon-svg-overlay.js";
import { computed, ref, watch } from 'vue';
import { useContentsStore } from '@/stores/contents';
import MessageBox from '@/components/MessageBox.vue';
import { delay } from '@/utils';
import { useAnnotationsStore } from "@/stores/annotations";

const emit = defineEmits('loading');

const contentStore = useContentsStore();
const annotationStore = useAnnotationsStore();

const viewer = ref(null);
const error = ref(null);

const item = computed(() => contentStore.item);
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

let polygons = [];

watch(() => annotationStore.activeAnnotations, (value) => {
  polygons.forEach(polygon => {
   if (Object.keys(value).includes(polygon.getAttribute('data-annotation-id'))) {
     polygon.classList.add('selected');
   } else {
     polygon.classList.remove('selected');
   }
  });
});

watch(() => annotationStore.filteredAnnotations, () => {
  if (!viewer.value) return;
  createPolygons();
});

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
      console.error(e);
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
    createPolygons();
  });

  viewer.value.addHandler('open-failed', () => {
    error.value = { message: 'error_open_image' };
    emit('loading', false);
  });
}

function createPolygons() {
  removePolygons();
  const imageAnnotations = annotationStore.filteredAnnotations.filter(annotation => annotation.body['x-content-type'] === 'LineSegmentation');

  if (imageAnnotations.length === 0) return;

  const svgOverlay = new SVGOverlay(viewer.value, OpenSeadragon);
  const svg = svgOverlay.getNode();

  polygons = imageAnnotations.map(annotation => {
    const [x,y,w,h] = annotation.target[0].selector.value.split(':')[1].split(',').map(value => parseFloat(value) / 100);

    // For absolute values use this:
    // const [x,y,w,h] = annotation.target[0].selector.value.split(':')[1].split(',').map(value => parseInt(value))
    // const imageWidth  = viewer.value.world.getItemAt(0).getContentSize().x;
    // const imageHeight = viewer.value.world.getItemAt(0).getContentSize().y;
    // const coords = [[x/imageWidth, y/imageHeight], [(x+w)/imageWidth, y/imageHeight], [(x+w)/imageWidth, (y+h)/imageHeight], [(x+w)/imageWidth, (y+h)/imageHeight]];

    const coords = [[x, y], [x+w, y], [x+w, y+h], [x, y+h]];

    const polygon = document.createElementNS("http://www.w3.org/2000/svg","polygon");
    polygon.setAttribute("data-annotation-id", annotation.id);
    polygon.setAttribute("points", coords.map(c => c.join(',')).join(' '));
    polygon.classList.add('tido-polygon');
    svg.appendChild(polygon);

    return polygon;
  });

  polygons.forEach(polygon => {
    svgOverlay.onClick(polygon, () => {
      const id = polygon.getAttribute('data-annotation-id');

      if (polygon.classList.contains('selected')) {
        annotationStore.removeActiveAnnotation(id);
      } else {
        annotationStore.addActiveAnnotation(id);
      }
    });
  });
}

function removePolygons() {
  polygons.forEach(p => p.remove());
}
</script>
<style lang="scss">
  .tido-polygon {
    fill: rgba(0,0,0,0.1);
    stroke: rgba(0,0,0,0.3);
    stroke-width: 0.002;
    cursor: pointer;

    &:hover {
      stroke: rgba(0,0,0,0.5);
    }

    &.selected {
      fill: rgb(var(--color-primary), 0.2);
      stroke: rgb(var(--color-primary));
    }
  }
</style>
