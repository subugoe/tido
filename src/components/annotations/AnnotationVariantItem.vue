<template>
  <div v-for="(variant, i) in annotation.body.value" :key="i"  class="t-items-center t-flex t-mb-1"
    :class="[
              't-py-2 t-px-3 t-mb-1 t-rounded-md',
              { 'hover:t-bg-gray-200 dark:hover:t-bg-gray-600 t-cursor-pointer': !isText(annotation) && !isActive(annotation) },
              { 't-bg-gray-300 dark:t-bg-gray-600 active': isVariantItemActive(variant.witness) }]"
                @click="isText(annotation) ? ()=>{} : handleClick(variant.witness)" :data-annotation-id="annotation.id">
        <div class="t-relative  t-rounded-3xl t-box-border t-w-75 t-h-8 t-border-2 t-p-[2px]" :style="{'border-color': getItemColorBasedOnIndex(i)}">
          <span v-if="variant.witness" v-html="variant.witness" class="t-text-sm"/>
          <span v-else class="t-text-sm"> - </span>
        </div>
        <span v-html="variant.entry" class="t-absolute t-right-[50%]"/>
  </div>
</template>



<script setup lang="ts">
import { getItemColorBasedOnIndex } from '@/utils/color';
import { computed, reactive } from 'vue';


export interface Props {
  annotation: Annotation,
  isText: (annotation: Annotation) => boolean,
  isActive: (annotation: Annotation) => boolean,
  toggle: (annotation: Annotation) => void,
}

const props = withDefaults(defineProps<Props>(), {
  annotation: () => <Annotation>{},
  isText: () => true,
  isActive: () => true,
  toggle: () => null,
})


// select only the variant item when it is clicked and highlighted only 
// the highlighted text should stay 'more highlighted', when we have at least one variant item selected

function initializeSelectionOfVariantItem() {
  let variantItemsDict = {}
  props.annotation.body.value.forEach((variantItem) => {
    const witness = variantItem.witness
    variantItemsDict[witness] = false
  })

  const variantItemsDictReactive = reactive(variantItemsDict)

  return variantItemsDictReactive
}

let variantItemsDict = initializeSelectionOfVariantItem()


function handleClick(witness) {
  // if at least one variant item is selected, then we don't toggle this annotation
  //props.toggle(props.annotation)
  variantItemsDict[witness] = !variantItemsDict[witness]
}

function isAtLeastOneVariantItemClicked() {
  let isClicked = false
  Object.keys(variantItemsDict).forEach((witness) => {
    if (variantItemsDict[witness] === true) isClicked = true
  })
  return isClicked
}

function isVariantItemActive(witness): boolean{
  return variantItemsDict[witness] === true
}




</script>



<style scoped>

</style>