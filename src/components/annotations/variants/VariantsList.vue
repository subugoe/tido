<template>
  <div
    v-if="visibleAnnotations.length > 0"
    class="annotations-list t-overflow-visible"
  >
    <VariantItem
      v-for="(annotation, i) in visibleAnnotations"
      :key="annotation.id"
      :annotation="annotation"
      :is-active="isActive(annotation)"
      :toggle="toggle"
      :witness-color="getWitnessColor(annotation.body.value.witness)"
      :show-separator="showLineSeparator(visibleAnnotations, i)"
      @select="addAnnotation(annotation.id)"
      @unselect="removeAnnotation(annotation.id)"
      @show-details="openDetailsDialog"
    />
  </div>
  <MessageBox
    v-else
    :message="getVariantsListInfoMessage()"
    :title="getVariantsListInfoTitle()"
    type="info"
  />
</template>


<script setup lang="ts">
import { computed } from 'vue';
import VariantItem from "@/components/annotations/variants/VariantItem.vue";
import { useAnnotationsStore } from "@/stores/annotations";
import MessageBox from "@/components/MessageBox.vue";
import * as Utils from '@/utils/annotations'
import i18n from '@/i18n'
import { useConfigStore } from '@/stores/config';

const annotationStore = useAnnotationsStore();
const configStore = useConfigStore()

const lang = computed<string>(() => configStore.config.lang)
const activeAnnotations = computed<ActiveAnnotation>(() => annotationStore.activeAnnotations);
const visibleAnnotations = computed<Annotation[]>(() => annotationStore.visibleAnnotations);


function isActive(annotation: Annotation): boolean {
  return !!activeAnnotations.value[annotation.id];
}

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

function getWitnessColor(witness: string) {
  return annotationStore.variantItemsColors[witness];
}

function getVariantsListInfoMessage(): string {
  if (annotationStore.isSingleSelectMode 
        && annotationStore.filteredAnnotations.length > 0) {
    return i18n[lang.value]['single_select_mode_info_message']
  }
  return i18n[lang.value]['no_annotations_in_view']
}

function getVariantsListInfoTitle(): string {
  if (annotationStore.isSingleSelectMode 
        && annotationStore.filteredAnnotations.length > 0) {
    return i18n[lang.value]['single_select_mode']
  }
  return i18n[lang.value]['no_annotations_available']
}
 

function showLineSeparator(visibleAnnotations, i) {
  if (visibleAnnotations[i+1]) {
   return Utils.generateTargetSelector(visibleAnnotations[i]) !== Utils.generateTargetSelector(visibleAnnotations[i+1])
  }
}

</script>
