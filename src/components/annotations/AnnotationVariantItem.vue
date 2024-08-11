<template>
  <div
    v-for="(variant, i) in annotation.body.value"
    :key="i"
    class="t-items-center t-flex t-mb-1 t-relative"
    :class="[
      't-py-2 t-px-3 t-mb-1 t-rounded-md',
      { 'hover:t-bg-gray-200 dark:hover:t-bg-gray-600 t-cursor-pointer': !isActive(annotation) },
      { 't-bg-gray-300 dark:t-bg-gray-600 active': isVariantItemActive(variant.witness)}]"
    :data-annotation-id="annotation.id"
    @click="handleClick(variant.witness, i)"
  >
    <div
      class="t-relative  t-rounded-3xl t-box-border t-w-75 t-h-8 t-border-2 t-p-[2px]"
      :style="{'border-color': getItemColorBasedOnIndex(i)}"
    >
      <span
        v-if="variant.witness"
        class="t-text-sm"
        v-html="variant.witness"
      />
      <span
        v-else
        class="t-text-sm"
      > - </span>
    </div>
    <span
      class="t-absolute t-right-[50%]"
      v-html="variant.entry"
    />
  </div>
</template>



<script setup lang="ts">
import { getItemColorBasedOnIndex } from '@/utils/color';
import { reactive, watch, computed } from 'vue';
import { useAnnotationsStore } from '@/stores/annotations';
import * as AnnotationUtils from '@/utils/annotations';


const annotationStore = useAnnotationsStore();
const activeAnnotSelectVariantItems = computed(() => annotationStore.activeAnnotSelectVariantItems);

export interface Props {
  annotation: Annotation,
  isActive: (annotation: Annotation) => boolean,
  toggle: (annotation: Annotation) => void,
}

const props = withDefaults(defineProps<Props>(), {
  annotation: () => <Annotation>{},
  isActive: () => true,
  toggle: () => null,
})

let initVariantItemsSelection = {}
let variantItemsColors = {}

  
watch(() => props.annotation, () => { 
  
  props.annotation.body.value.forEach((variantItem) => {
    const witness = variantItem.witness
    initVariantItemsSelection[witness] = false
  })
 })
 

function handleClick(witness: string, i: number) {
  // if at least one variant item is selected, then we don't toggle this annotation
  // for each variant item: we should save a state of selected or not, so that to show the icon or not...
  
  const witnessColor = getItemColorBasedOnIndex(i)
  if (witness in variantItemsColors === false) variantItemsColors[witness] = witnessColor

  const variantItemsSelection = pickVariantItemsSelection()

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
  activeAnnotSelectVariantItems.value[props.annotation.id] = [props.annotation, variantItemsSelection]

  const selector = props.annotation.target[0].selector.value
  if (variantItemsSelection[witness] === true) { // to change
    AnnotationUtils.addWitness(selector, witness, variantItemsColors)
  }
  else {
    AnnotationUtils.removeWitness(selector, witness)
  }
}

function isAtLeastOneVariantItemClicked() {
  const variantItemsSelection = pickVariantItemsSelection()

  let isClicked = false
  Object.keys(variantItemsSelection).forEach((witness) => {
    if (variantItemsSelection[witness] === true) isClicked = true
  })
  return isClicked
}


function isOnlyThisVariantActive(witness) {
  const variantItemsSelection = pickVariantItemsSelection()

  let isOnlyThisVariantClicked = true
  Object.keys(variantItemsSelection).forEach((wit) => {
    if (variantItemsSelection[wit] === true && wit!== witness) isOnlyThisVariantClicked = false
  })
  return isOnlyThisVariantClicked
}

function pickVariantItemsSelection() {
  // we pick the variant items selection, based on whether we have an active annotation or not
  // if we have active annotation - we use the value of 'activeAnnotSelectVariantItems' property in the annotation store
  // else: we use the initial variant items selection - all false values
  let variantItemsSelection;

  if (Object.keys(activeAnnotSelectVariantItems.value).length > 0) {
    if((props.annotation.id in activeAnnotSelectVariantItems.value) === false) {
      variantItemsSelection = { ...initVariantItemsSelection };
    }
    else {
      variantItemsSelection = activeAnnotSelectVariantItems.value[props.annotation.id][1]
    }
  }
  else {
    variantItemsSelection = { ...initVariantItemsSelection };
  }

  return variantItemsSelection
}

function isVariantItemActive(witness): boolean{

  if(Object.keys(activeAnnotSelectVariantItems.value).length > 0) {
      if( (props.annotation.id in activeAnnotSelectVariantItems.value) === false) {
        return false
      }
      else {
        return activeAnnotSelectVariantItems.value[props.annotation.id][1][witness]
      }
  }

  return false
}



</script>



<style scoped>

</style>