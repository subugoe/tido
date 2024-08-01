<template>
  <div class="annotations-list t-overflow-auto">
    <TopBar v-if="isVariantsTabOpened()" :variant-annotations="getVariantAnnotations()" />
    <div
      v-for="annotation in configuredAnnotations"
      :key="annotation.id"
    >
        <div v-if="!isVariant(annotation)" class="t-flex t-items-center t-space-x-2 item" :class="[
              't-py-2 t-px-3 t-mb-1 t-rounded-md',
              { 'hover:t-bg-gray-200 dark:hover:t-bg-gray-600 t-cursor-pointer': !isText(annotation) && !isActive(annotation) },
              { 't-bg-gray-300 dark:t-bg-gray-600 active': isActive(annotation) }]"
                @click="isText(annotation) ? ()=>{} : toggle(annotation)" :data-annotation-id="annotation.id"> 
          <AnnotationIcon
            v-if="!isText(annotation)"
            :name="getIconName(annotation.body['x-content-type'])"
          />
          <span  v-html="annotation.body.value"/>
        </div>

        <div v-else>
          <AnnotationVariantItem :annotation="annotation" :isText="isText" :isActive="isActive" :toggle="toggle"/>
        </div>
       
        <!-- eslint-disable -- https://eslint.vuejs.org/rules/no-v-html.html -->
    
        
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed } from 'vue';
import AnnotationIcon from '@/components/annotations/AnnotationIcon.vue';
import AnnotationVariantItem from '@/components/annotations/AnnotationVariantItem.vue'
import TopBar from '@/components/annotations/TopBar.vue'

interface AnnotationTypesMapping {
  [key: string]: string | 'annotation'
 }

export interface Props {
  activeAnnotation: ActiveAnnotation
  configuredAnnotations: Annotation[],
  toggle: (annotation: Annotation) => void,
  types: {name: string, icon: string, annotationType: string}[]
}

const props = withDefaults(defineProps<Props>(), {
  activeAnnotation: () => <ActiveAnnotation>{},
  configuredAnnotations: () => <Annotation[]> [],
  toggle: () => null,
})

const annotationTypesMapping = computed<AnnotationTypesMapping>(() => (
  // it returns an object with a varying number of 'key', 'value' pairs
  props.types.reduce((prev, curr) => {
    prev[curr.name] = curr.annotationType || 'annotation';
    return prev;
  }, {})
));

function isActive(annotation: Annotation): boolean {
  return !!props.activeAnnotation[annotation.id];
}
function isText(annotation: Annotation): boolean {
  return annotationTypesMapping.value[annotation.body['x-content-type']] === 'text';
}

function getIconName(typeName: string): string {
  return props.types.find(({ name }) => name === typeName)?.icon || 'pencil';
}

function isVariant(annotation) {
  return annotation.body['x-content-type'] === 'Variant';
}

function isVariantsTabOpened() {
  return props.configuredAnnotations[0].body['x-content-type'] === 'Variant';
}

function getVariantAnnotations(): Annotation[]{
  let variantAnnotations: Annotation[] = []
  props.configuredAnnotations.forEach((annotation) => {
    if (isVariant(annotation)) variantAnnotations.push(annotation)
  })

  return variantAnnotations
}

</script>



<style lang="scss" scoped>



</style>