<template>
  <div v-for="(variant, i) in annotation.body.value" :key="i"  class="t-items-center t-flex t-mb-1 t-relative"
    :class="[
              't-py-2 t-px-3 t-mb-1 t-rounded-md',
              { 'hover:t-bg-gray-200 dark:hover:t-bg-gray-600 t-cursor-pointer': !isText(annotation) && !isActive(annotation) },
              { 't-bg-gray-300 dark:t-bg-gray-600 active': isVariantItemActive(variant.witness)}]"
                @click="isText(annotation) ? ()=>{} : handleClick(variant.witness, i)" :data-annotation-id="annotation.id">
        <div class="t-relative  t-rounded-3xl t-box-border t-w-75 t-h-8 t-border-2 t-p-[2px]" :style="{'border-color': getItemColorBasedOnIndex(i)}">
          <span v-if="variant.witness" v-html="variant.witness" class="t-text-sm"/>
          <span v-else class="t-text-sm"> - </span>
        </div>
        <span v-html="variant.entry" class="t-absolute t-right-[50%]"/>
  </div>
</template>



<script setup lang="ts">
import { getItemColorBasedOnIndex } from '@/utils/color';
import { isReactive } from 'vue';
import { computed, reactive } from 'vue';
import * as AnnotationUtils from '@/utils/annotations';


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

let variantItemsSelection = initializeSelectionOfVariantItem()
let variantItemsColors = {}


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



function handleClick(witness: string, i: number) {
  // if at least one variant item is selected, then we don't toggle this annotation
  // for each variant item: we should save a state of selected or not, so that to show the icon or not...
  const witnessColor = getItemColorBasedOnIndex(i)
  if (witness in variantItemsColors === false) variantItemsColors[witness] = witnessColor

  if (!isAtLeastOneVariantItemClicked()) {
    // for the first variant item of each variant object
    props.toggle(props.annotation)
    
  }
  if ((isOnlyThisVariantActive(witness)) && (isVariantItemActive(witness))) {
    // when we have only one variant item of a certain variant object selected and then we deselect it -> remove the blue highlight from the text 
    props.toggle(props.annotation)
  }
  // update the state of 'false' or 'true' whether this variant item is selected or not
  variantItemsSelection[witness] = !variantItemsSelection[witness] 

  let selectorWithHash = props.annotation.target[0].selector.value
  const selector = selectorWithHash.slice(1,selectorWithHash.length)
  const variantItemsSelected: string[] = getVariantItemsSelected()
  if (variantItemsSelection[witness] === true) {
    AnnotationUtils.addWitness(selector, witness, witnessColor, variantItemsSelected, variantItemsColors)
  }
  else {
     console.log('remove the witness')
  }
  
    
  // if the variant item is selected: then we add the witness 'chip' to the annotated text
  // if not, then we remove the witness chip to the annotated text

  // need to find the html element of the selector
}

function isAtLeastOneVariantItemClicked() {
  let isClicked = false
  Object.keys(variantItemsSelection).forEach((witness) => {
    if (variantItemsSelection[witness] === true) isClicked = true
  })
  return isClicked
}

function isOnlyThisVariantActive(witness) {
  let isOnlyThisVariantClicked = true
  Object.keys(variantItemsSelection).forEach((wit) => {
    if (variantItemsSelection[wit] === true && wit!== witness) isOnlyThisVariantClicked = false
  })
  return isOnlyThisVariantClicked
}

function isVariantItemActive(witness): boolean{
  return variantItemsSelection[witness] === true
}


function getVariantItemsSelected(): string[] {
  let variantItemsSelected: string[] = []
  Object.keys(variantItemsSelection).forEach((wit) => {
    if (variantItemsSelection[wit] === true) variantItemsSelected.push(wit)
  })

  return variantItemsSelected

}



</script>



<style scoped>

</style>