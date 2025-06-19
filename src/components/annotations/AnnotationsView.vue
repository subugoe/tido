<template>
  <div class="t-p-4 t-overflow-auto">
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
import { mapActiveContentMapToString } from "@/utils/text";

const annotationStore = useAnnotationsStore();
const contentStore = useContentsStore();
interface Props {
  types: AnnotationType[]
}
const props = defineProps<Props>();
const emit = defineEmits(['init'])

let lastLoadedAnnotations = null;
let lastLoadedContentUrl = null;

const annotations = computed<Annotation[]>(() => annotationStore.annotations);
const filteredAnnotations = computed<Annotation[]>(() => annotationStore.filteredAnnotations);
const activeContentMap = computed<{[key: string]: string }>(() => contentStore.activeContentMap);
const updateTextHighlighting = computed(() => {
  // We need to make sure that annotations are loaded (this.annotations),
  // the text HTML is present in DOM (this.activeContentMap is set after DOM update)
  // and the annotation are filtered by type (this.filteredAnnotations).
  const activeContentString = mapActiveContentMapToString(activeContentMap.value);
  const annotationsChanged = lastLoadedAnnotations !== annotations.value;
  const contentChanged = lastLoadedContentUrl !== activeContentString;
  return `${annotations.value !== null}|${contentChanged}|${annotationsChanged}|${activeContentString}`
});

watch(
  updateTextHighlighting,
  (value) => {
    if (!value) return;

    const [hasAnnotations, contentChanged, annotationsChanged, activeContentMap] = value.split('|');
    if (hasAnnotations !== 'true' || (contentChanged !== 'true' && annotationsChanged !== 'true') || activeContentMap === 'null') return;

    lastLoadedAnnotations = annotationStore.annotations;
    lastLoadedContentUrl = activeContentMap;
    annotationStore.resetAnnotations();
    annotationStore.selectFilteredAnnotations(props.types);
    annotationStore.highlightTargetsLevel0();
    emit('init')
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

  const listItems = []
  Object.keys(annotationIds).forEach((id) => {
    const el = document.querySelector(`[data-annotation-id="${id}"]`);
    if (el) listItems.push(el)

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

  if (listItems.length > 0) {
    // Scroll to the first list item in annotation list
    Utils.scrollIntoViewIfNeeded(listItems[0], listItems[0].closest('.panel-body'));
  }
})

onBeforeUnmount(() => unsubscribe())

</script>
