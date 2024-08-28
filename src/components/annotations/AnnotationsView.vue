<template>
  <div class="t-p-4">
    <AnnotationsList
      v-if="filteredAnnotations.length > 0"
      class="custom-font"
      :annotations="filteredAnnotations"
      :types="types"
    />
    <MessageBox
      v-else
      :message="$t('no_annotations_in_view')"
      :title="$t('no_annotations_available')"
      type="info"
    />
  </div>
</template>

<script setup lang="ts">
import {
  computed, watch,
} from 'vue';
import AnnotationsList from '@/components/annotations/AnnotationsList.vue';
import MessageBox from '@/components/MessageBox.vue';

import { useAnnotationsStore } from '@/stores/annotations';
import { useContentsStore } from '@/stores/contents';

const annotationStore = useAnnotationsStore();
const contentStore = useContentsStore();
interface Props {
  types: AnnotationType[]
}
const props = defineProps<Props>();

const annotations = computed<Annotation[]>(() => annotationStore.annotations);
const filteredAnnotations = computed<Annotation[]>(() => annotationStore.filteredAnnotations);
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
    annotationStore.resetAnnotations();
    annotationStore.selectFilteredAnnotations(props.types);
    annotationStore.highlightTargetsLevel0();
  },
  { immediate: true },
);
</script>
