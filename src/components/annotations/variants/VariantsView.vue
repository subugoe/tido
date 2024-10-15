<script setup lang="ts">

import VariantsTopBar from "@/components/annotations/variants/VariantsTopBar.vue";
import VariantsList from "@/components/annotations/variants/VariantsList.vue";
import { getItemColorBasedOnIndex } from '@/utils/color';
import {useAnnotationsStore} from "@/stores/annotations";
import {computed, onBeforeUnmount, watch} from "vue";
import {useContentsStore} from "@/stores/contents";
import TextEventBus from "@/utils/TextEventBus";
import {getAnnotationIdsFromTarget} from "@/utils/text";
const annotationStore = useAnnotationsStore();
const contentsStore = useContentsStore();

allocateWitnessColorInVariantItem()

const annotations = computed<Annotation[]>(() => annotationStore.annotations);
const activeContentUrl = computed<string>(() => contentsStore.activeContentUrl);
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
    annotationStore.selectFilteredAnnotations([{ name: 'Variant' }]);
    annotationStore.highlightTargetsLevel0();
  },
  { immediate: true },
);

const unsubscribe = TextEventBus.on('click', ({ target }) => {
  const targetIsSelected = parseInt(target.getAttribute('data-annotation-level'), 10) > 0;

  const ids = getAnnotationIdsFromTarget(target)

  if (annotationStore.isSingleSelectMode) {
    if (targetIsSelected) {
      annotationStore.removeFilteredAnnotations(ids)
      annotationStore.deactivateAnnotationsByIds(ids)
    }
    else {
      annotationStore.addFilteredAnnotations(ids)
      annotationStore.activateAnnotationsByIds(ids)
    }
  } else {
    if (targetIsSelected) {
      annotationStore.deactivateAnnotationsByIds(ids)
    }
    else {
      annotationStore.activateAnnotationsByIds(ids)
    }
  }
})

onBeforeUnmount(() => unsubscribe())

function allocateWitnessColorInVariantItem() {
  const colors = {}
  if(annotationStore.witnesses?.length === 0) return;

  annotationStore.witnesses.forEach((witness, i) => {
  colors[witness.idno] = getItemColorBasedOnIndex(i)
  annotationStore.setVariantItemsColors(colors)
  })
  }

</script>

<template>
  <div class="t-flex t-flex-col t-p-4">
    <div class="t-mb-2">
      <VariantsTopBar />
    </div>
    <div class="t-flex-1 t-overflow-visible">
      <VariantsList />
    </div>
  </div>
</template>
