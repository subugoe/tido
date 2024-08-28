<template>
  <div
    v-if="filteredAnnotations.length > 0"
    class="annotations-list t-overflow-visible"
  >
    <VariantItem
      v-for="annotation in filteredAnnotations"
      :key="annotation.id"
      :annotation="annotation"
      :is-active="isActive(annotation)"
      :toggle="toggle"
      :witness-color="getWitnessColor(annotation.body.value.witness)"
      @select="addAnnotation(annotation.id)"
      @unselect="removeAnnotation(annotation.id)"
      @show-details="openDetailsDialog"
    />
  </div>
  <MessageBox
    v-else
    :message="$t('no_annotations_in_view')"
    :title="$t('no_annotations_available')"
    type="info"
  />
</template>


<script setup lang="ts">
import { computed } from 'vue';
import VariantItem from "@/components/annotations/variants/VariantItem.vue";
import {useAnnotationsStore} from "@/stores/annotations";
import MessageBox from "@/components/MessageBox.vue";

const annotationStore = useAnnotationsStore();


const activeAnnotations = computed<ActiveAnnotation>(() => annotationStore.activeAnnotations);
const filteredAnnotations = computed<Annotation[]>(() => annotationStore.filteredAnnotations);


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

</script>
