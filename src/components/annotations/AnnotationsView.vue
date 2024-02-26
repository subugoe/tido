<template>
  <div class="annotations-view t-px-4 t-pt-4">
    <AnnotationsList
      v-if="filteredAnnotations.length"
      class="custom-font"
      :active-annotation="activeAnnotations"
      :config="config"
      :configured-annotations="filteredAnnotations"
      :toggle="toggle"
      :types="types"
    />
    <div v-else class="t-pa-4">
      <Notification
        :message="$t(message)"
        :notification-colors="config.notificationColors"
        :title="$t('no_annotations_available')"
        type="info"
      />
    </div>
  </div>
</template>

<script setup>
import {
  computed, onBeforeUnmount, ref, watch,
} from 'vue';
import { useStore } from 'vuex';
import AnnotationsList from '@/components/annotations/AnnotationsList.vue';
import Notification from '@/components/Notification.vue';
import * as AnnotationUtils from '@/utils/annotations';

const props = defineProps({
  url: String,
  types: Array,
});

const store = useStore();
const message = ref('no_annotations_in_view');

const config = computed(() => store.getters['config/config']);
const annotations = computed(() => store.getters['annotations/annotations']);
const activeAnnotations = computed(() => store.getters['annotations/activeAnnotations']);
const filteredAnnotations = computed(() => store.getters['annotations/filteredAnnotations']);
const activeContentUrl = computed(() => store.getters['contents/activeContentUrl']);
const updateTextHighlighting = computed(() =>
  // We need to make sure that annotations are loaded (this.annotations),
  // the text HTML is present in DOM (this.activeContentUrl is set after DOM update)
  // and the annotation are filtered by type (this.filteredAnnotations).
  `${annotations.value !== null}|${activeContentUrl.value}`);

watch(
  updateTextHighlighting,
  (contentData) => {
    const [hasAnnotations, activeContentUrl] = contentData.split('|');
    if (hasAnnotations !== 'true' || activeContentUrl === 'null') return;
    store.dispatch('annotations/resetAnnotations');
    store.dispatch('annotations/setFilteredAnnotations', props.types);
    highlightTargetsLevel0();
  },
  { immediate: true },
);

function addAnnotation(id) {
  store.dispatch('annotations/addActiveAnnotation', id);
}

function removeAnnotation(id) {
  store.dispatch('annotations/removeActiveAnnotation', id);
}

function toggle({ id }) {
  const exists = !!activeAnnotations.value[id];
  if (exists) {
    removeAnnotation(id);
  } else {
    addAnnotation(id);
  }
}

function highlightTargetsLevel0() {
  const mergedSelector = filteredAnnotations.value
    .reduce((acc, cur) => {
      const selector = AnnotationUtils.generateTargetSelector(cur);
      if (acc !== '') {
        acc += ',';
      }
      acc += selector;
      return acc;
    }, '');

  if (mergedSelector) {
    AnnotationUtils.highlightTargets(mergedSelector, { level: 0 });
  }
}
</script>

<style scoped>

</style>
