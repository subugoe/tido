<template>
  <div class="item-content t-overflow-auto">
    <div
      v-for="annotation in configuredAnnotations"
      :data-annotation-id="annotation.id"
      :key="annotation.id"
      :class="[
        't-py-2 t-px-3 t-mb-1 t-rounded-md t-cursor-pointer',
        { 'hover:t-bg-gray-200': !isActive(annotation) },
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

<script setup>
import { computed, watch } from 'vue';
import AnnotationIcon from '@/components/annotations/AnnotationIcon.vue';

const props = defineProps({
  activeAnnotation: {
    type: Object,
    default: () => {},
  },
  configuredAnnotations: {
    type: Array,
    default: () => [],
  },
  toggle: {
    type: Function,
    default: () => null,
  },
  types: Array,
});

watch(() => props.configuredAnnotations, (value) => console.log(value));

const annotationTypesMapping = computed(() => (
  props.types.reduce((prev, curr) => {
    prev[curr.name] = curr.annotationType || 'annotation';
    return prev;
  }, {})
));

function isActive(annotation) {
  return !!props.activeAnnotation[annotation.id];
}
function isText(annotation) {
  return annotationTypesMapping.value[annotation.body['x-content-type']] === 'text';
}
function getIconName(typeName) {
  return props.types.find(({ name }) => name === typeName)?.icon || 'biPencilSquare';
}
</script>
