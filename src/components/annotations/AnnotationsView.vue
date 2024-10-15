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
  computed, watch, onBeforeUnmount
} from 'vue';
import AnnotationsList from '@/components/annotations/AnnotationsList.vue';
import MessageBox from '@/components/MessageBox.vue';
import TextEventBus from "@/utils/TextEventBus";
import * as Utils from '@/utils';
import * as TextUtils from '@/utils/text'


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


const unsubscribe = TextEventBus.on('click', ({ target }) => {

    // Next we look up which annotations need to be selected
  let annotationIds = {};

  Utils.getValuesFromAttribute(target, 'data-annotation-ids').forEach((value) => annotationIds[value] = true);
  annotationIds = TextUtils.discoverParentAnnotationIds(target, annotationIds);
  annotationIds = TextUtils.discoverChildAnnotationIds(target, annotationIds);

  // We check the highlighting level to determine whether to select or deselect.
  // TODO: it might be better to check the activeAnnotations instead
  const targetIsSelected = parseInt(target.getAttribute('data-annotation-level'), 10) > 0;

  Object.keys(annotationIds).forEach((id) => {
    // We need to check here if the right annotations panel tab is active
    // a.k.a. it exists in the current filteredAnnotations
    const annotation = filteredAnnotations.value.find((filtered) => filtered.id === id);
    if (annotation) {
      if (targetIsSelected) {
        annotationStore.removeActiveAnnotation(id)
      } else {
        annotationStore.addActiveAnnotation(id)
      }
    }
  });
})

onBeforeUnmount(() => unsubscribe())

</script>
