<template>
  <div
    v-if="filteredAnnotations.length"
    class="annotations-list t-overflow-auto"
  >
    <div
      v-for="annotation in annotations"
      :key="annotation.id"
    >
      <div
        class="t-flex t-items-center t-space-x-2 item"
        :class="[
          't-py-2 t-px-3 t-mb-1 t-rounded-md',
          { 'hover:t-bg-gray-200 dark:hover:t-bg-gray-600 t-cursor-pointer': !isText(annotation) && !isActive(annotation) },
          { 't-bg-gray-300 dark:t-bg-gray-600 active': isActive(annotation) }]"
        :data-annotation-id="annotation.id"
        @click="isText(annotation) ? ()=>{} : toggle(annotation)"
      >
        <AnnotationIcon
          v-if="!isText(annotation) && showAnnotationUtils"
          :name="getIconName(annotation.body['x-content-type'])"
        />
        <span
          class="t-break-all"
          v-html="annotation.body.value"
        />
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed } from 'vue';
import AnnotationIcon from '@/components/annotations/AnnotationIcon.vue';
import {useAnnotationsStore} from "@/stores/annotations";
import {useConfigStore} from "@/stores/config";

interface AnnotationTypesMapping {
  [key: string]: string | 'annotation'
 }

export interface Props {
  annotations: Annotation[],
  types: AnnotationType[]
}

const annotationStore = useAnnotationsStore();
const configStore = useConfigStore()

const props = withDefaults(defineProps<Props>(), {
  annotations: () => <Annotation[]> [],
});

const activeAnnotations = computed<ActiveAnnotation>(() => annotationStore.activeAnnotations);
const filteredAnnotations = computed<Annotation[]>(() => annotationStore.filteredAnnotations);
const showAnnotationUtils = computed<boolean>(() => configStore.config.showAnnotationIcons);

const annotationTypesMapping = computed<AnnotationTypesMapping>(() => (
  // it returns an object with a varying number of 'key', 'value' pairs
  props.types.reduce((prev, curr) => {
    prev[curr.name] = curr.annotationType || 'annotation';
    return prev;
  }, {})
));

function isActive(annotation: Annotation): boolean {
  return !!activeAnnotations.value[annotation.id];
}
function isText(annotation: Annotation): boolean {
  return annotationTypesMapping.value[annotation.body['x-content-type']] === 'text';
}

function getIconName(typeName: string): string {
  return props.types.find(({ name }) => name === typeName)?.icon || 'pencil';
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
