<script setup lang="ts">

import VariantsTopBar from "@/components/annotations/variants/VariantsTopBar.vue";
import VariantsList from "@/components/annotations/variants/VariantsList.vue";
import { getItemColorBasedOnIndex } from '@/utils/color';
import {useAnnotationsStore} from "@/stores/annotations";
import {computed, onBeforeUnmount, watch} from "vue";
import {useContentsStore} from "@/stores/contents";
import TextEventBus from "@/utils/TextEventBus";
import {getAnnotationIdsFromTarget} from "@/utils/text";
import { getVariantAnnotations } from '@/utils/annotations'

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
    annotationStore.isSingleSelectMode = false
  },
  { immediate: true },
);

const unsubscribe = TextEventBus.on('click', ({ target }) => {

  let ids = getAnnotationIdsFromTarget(target)
  // ids are all the annotation ids of the target, which can be in different tabs. 
  // we need to filter only the variant ides before proceeding with adding active annotation or removing active annotation
  const variantAnnotations = getVariantAnnotations(annotationStore.annotations, 'Variant')
  const variantAnnotationIds = variantAnnotations.map((annotation) => annotation.id)
  ids = ids.filter((id) => variantAnnotationIds.includes(id))

  const annotations = annotationStore.visibleAnnotations.filter((filtered) => ids.find(id => filtered.id === id))
  if (!annotationStore.isSingleSelectMode) {
    // We check if the found annotation ids are currently displayed in the active tab, if not we skip the handling
    // the annotations referring to the target are not displayed - we do not proceed further
    if (annotations.length === 0) return
  } else {
    // if we are in single select mode, we still have variant annotations, but there are not shown
    // if we click at a part of text whose related annotations are not in the variant annotations, then we do not proceed further
    if (ids.length < 1) return
  }

  const targetIsSelected = parseInt(target.getAttribute('data-annotation-level'), 10) > 0

  if (annotationStore.isSingleSelectMode) {
    if (targetIsSelected) {
      annotationStore.removeVisibleAnnotations(ids)
      annotationStore.deactivateAnnotationsByIds(ids)
    } else {
      annotationStore.addVisibleAnnotations(ids)
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
  if (!annotationStore.witnesses) return
  if (annotationStore.witnesses.length === 0) return;

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
