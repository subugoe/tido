<template>
  <div class="annotations-view q-px-md q-pt-md">
    <AnnotationsList
      v-if="filteredAnnotations.length"
      class="custom-font"
      :active-annotation="activeAnnotations"
      :config="config"
      :configured-annotations="filteredAnnotations"
      :toggle="toggle"
      :types="types"
    />
    <div v-else class="q-pa-md">
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

const store = useStore();

const props = defineProps({
  url: String,
  types: Array,
});

const message = ref('no_annotations_in_view');

const config = computed(() => store.getters['config/config']);
const annotations = computed(() => store.getters['annotations/annotations']);
const item = computed(() => store.getters['contents/item']);
const activeAnnotations = computed(() => store.getters['annotations/activeAnnotations']);
const filteredAnnotations = computed(() => store.getters['annotations/filteredAnnotations']);
const activeContentUrl = computed(() => store.getters['contents/activeContentUrl']);
const updateTextHighlighting = computed(() =>
  // We need to make sure that annotations are loaded (annotations.value),
  // the text HTML is present in DOM (activeContentUrl.value is set after DOM update)
  // and the annotation are filtered by type (this.filteredAnnotations).
  `${annotations.value !== null}|${activeContentUrl.value}`);

watch(updateTextHighlighting, (contentData) => {
  if (contentData) {
    const [hasAnnotations, activeContentUrlValue] = contentData.split('|');
    if (hasAnnotations !== 'true' && activeContentUrlValue === 'null') return;
    store.dispatch('annotations/setFilteredAnnotations', props.types);
    highlightTargetsLevel0();
  }
}, { immediate: true });

onBeforeUnmount(() => store.dispatch('annotations/resetAnnotations'));

function addAnnotation(id) {
  store.dispatch('annotations/addActiveAnnotation', id);
}
function removeAnnotation(id) {
  store.dispatch('annotations/removeActiveAnnotation', id);
}
function toggle({ id }) {
  const exists = !!this.activeAnnotations[id];
  if (exists) {
    removeAnnotation(id);
  } else {
    addAnnotation(id);
  }
}
function highlightTargetsLevel0() {
  const mergedSelector = this.filteredAnnotations
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
