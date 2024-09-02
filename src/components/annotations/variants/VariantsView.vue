<script setup lang="ts">

import VariantsTopBar from "@/components/annotations/variants/VariantsTopBar.vue";
import VariantsList from "@/components/annotations/variants/VariantsList.vue";
import { getItemColorBasedOnIndex } from '@/utils/color';
import {useAnnotationsStore} from "@/stores/annotations";
import {computed, watch} from "vue";
import {useContentsStore} from "@/stores/contents";
import TextEventBus from "@/utils/TextEventBus";
import * as TextUtils from '@/utils/text'
import * as DomUtils from '@/utils/dom'
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

TextEventBus.on('click', ({ target }) => {
  let annotationIds = {};
  DomUtils.getValuesFromAttribute(target, 'data-annotation-ids').forEach((value) => annotationIds[value] = true);
  annotationIds = TextUtils.discoverParentAnnotationIds(target, annotationIds);
  annotationIds = TextUtils.discoverChildAnnotationIds(target, annotationIds);

  // We check the highlighting level to determine whether to select or deselect.
  // TODO: it might be better to check the activeAnnotations instead
  const targetIsSelected = parseInt(target.getAttribute('data-annotation-level'), 10) > 0;

  Object.keys(annotationIds).forEach((id) => {
    // We need to check here if the right annotations panel tab is active
    // a.k.a. it exists in the current filteredAnnotations
    const annotation = annotationStore.annotations.find((a) => a.id === id);
    if (annotation) {
      if (targetIsSelected) {
        const index = annotationStore.filteredAnnotations
          .findIndex(filteredAnnotation => filteredAnnotation.id === annotation.id)
        if (index > -1) {
          annotationStore.filteredAnnotations.splice(index, 1)
          annotationStore.removeActiveAnnotation(annotation.id)
        }
      } else {
        annotationStore.filteredAnnotations.push(annotation)
        annotationStore.addActiveAnnotation(annotation.id)
      }
    }
  });
})

function allocateWitnessColorInVariantItem() {
  const colors = {}
  annotationStore.witnesses.forEach((witness, i) => {
    colors[witness.idno] = getItemColorBasedOnIndex(i)
  })
  annotationStore.setVariantItemsColors(colors)
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
