<template>
  <div class="annotations-list t-overflow-auto">
    <div
      v-for="annotation in configuredAnnotations"
      :data-annotation-id="annotation.id"
      :key="annotation.id"
      class="item"
      :class="[
        't-py-2 t-px-3 t-mb-1 t-rounded-md',
        { 'hover:t-bg-gray-200 dark:hover:t-bg-gray-600 t-cursor-pointer': !isText(annotation) && !isActive(annotation) },
        { 't-bg-gray-300 dark:t-bg-gray-600 active': isActive(annotation) }
      ]"
      @click="isText(annotation) ? ()=>{} : toggle(annotation)"
    >
      <div class="t-flex t-items-center t-space-x-2">
        <AnnotationIcon v-if="!isText(annotation)" :name="getIconName(annotation.body['x-content-type'])" />
        <!-- eslint-disable -- https://eslint.vuejs.org/rules/no-v-html.html -->
        <span v-html="annotation.body.value" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import AnnotationIcon from '@/components/annotations/AnnotationIcon.vue';


export interface Props {
  activeAnnotation: ActiveAnnotation
  configuredAnnotations: Annotation[],
  toggle: Function,
  types: any[]
}

const props = withDefaults(defineProps<Props>(), {
  activeAnnotation: () => <ActiveAnnotation>{},
  configuredAnnotations: () => <Annotation[]> [],
  toggle: () => null,
})

const annotationTypesMapping = computed<Object>(() => (
  // it returns an object with a varying number of 'key', 'value' pairs
  props.types.reduce((prev, curr) => {
    prev[curr.name] = curr.annotationType || 'annotation';
    return prev;
  }, {})
));

function isActive(annotation: Annotation): boolean {
  return !!props.activeAnnotation[annotation.id];
}
function isText(annotation: Annotation) : boolean {
  return annotationTypesMapping.value[annotation.body['x-content-type']] === 'text';
}
function getIconName(typeName: string): string {
  // Question: is there any range of values for the typeName ? I set it to 'string' by considering examples when just printing it
  return props.types.find(({ name }) => name === typeName)?.icon || 'biPencilSquare';
}
</script>
