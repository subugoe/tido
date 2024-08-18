<template>
  <div class="annotations-list t-overflow-auto">
    <div
      v-for="annotation in annotations"
      :key="annotation.id"
    >
      <VariantItem
        :annotation="annotation"
        :is-active="isActive"
        :toggle="toggle"
      />
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed } from 'vue';
import VariantItem from "@/components/annotations/variants/VariantItem.vue";
import {useAnnotationsStore} from "@/stores/annotations";


export interface Props {
  annotations: Annotation[],
  types: {name: string, icon: string, annotationType: string}[]
}

const annotationStore = useAnnotationsStore();


withDefaults(defineProps<Props>(), {
  annotations: () => <Annotation[]> [],
})

const activeAnnotations = computed<ActiveAnnotation>(() => annotationStore.activeAnnotations);

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

</script>
