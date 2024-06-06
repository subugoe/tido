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
    <Notification
      v-else
      :message="$t(message)"
      :notification-colors="config.notificationColors"
      :title="$t('no_annotations_available')"
      type="info"
    />
  </div>
</template>

<script setup lang="ts">
import {
  computed, ref, watch,
} from 'vue';
import AnnotationsList from '@/components/annotations/AnnotationsList.vue';
import Notification from '@/components/Notification.vue';
import * as AnnotationUtils from '@/utils/annotations';

import { useConfigStore } from '@/stores/config';
import { useAnnotationsStore } from '@/stores/annotations';
import { useContentsStore} from '@/stores/contents';

const configStore = useConfigStore()
const annotationStore = useAnnotationsStore()
const contentStore = useContentsStore()

const props = defineProps({
  url: String,
  types: Array,
});

const message = ref('no_annotations_in_view');

const config = computed(() => configStore.config);
const annotations = computed<Annotation[]>(() => annotationStore.annotations);
const activeAnnotations = computed<ActiveAnnotation>(() => annotationStore.activeAnnotations);
const filteredAnnotations = computed<Annotation[]>(() =>  annotationStore.filteredAnnotations);
const activeContentUrl = computed<string>(() => contentStore.activeContentUrl); 
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
    annotationStore.resetAnnotations()
    annotationStore.selectFilteredAnnotations(props.types)
    highlightTargetsLevel0();
  },
  { immediate: true },
);

function addAnnotation(id: string) {
  annotationStore.addActiveAnnotation(id);
}

function removeAnnotation(id: string) {
  annotationStore.removeActiveAnnotation(id);
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