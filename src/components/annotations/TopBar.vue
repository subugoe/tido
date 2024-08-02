<template>
    <div class="t-items-center t-flex t-mb-[30px]">
        <WitnessChipInTopBar v-for="(witness, i) in getWitnesses()" :key="i" :witness="witness" :variantAnnotations="variantAnnotations" :index="i"/>
        <div class="t-ml-[70px]">
          <button class="t-border-[2px] t-rounded-[5px] t-border-sky-400 t-w-[100px] t-bg-sky-200 t-hover:bg-sky-700 t-mr-[2px] t-text-[15px] t-font-bold t-text-sky-500" 
              @click="handleVariantsClick()"> Variants </button>
          <button class="t-border-[1px] t-rounded-[5px] t-border-slate-300 t-w-[100px] t-text-[15px] t-text-zinc-500" 
               @click="handleWitnessesClick()"> Witnesses </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getItemColorBasedOnIndex } from '@/utils/color'
import WitnessChipInTopBar from '@/components/annotations/WitnessChipInTopBar.vue'


export interface Props {
  variantAnnotations: Annotation[]
}

const props = withDefaults(defineProps<Props>(), {
  variantAnnotations: () => <Annotation[]>[],
})

const checked = ref(false);

function getWitnesses(): string[] {
    let witnessesString: string [] = []
    props.variantAnnotations.forEach((annotation) => {
      annotation.body.value.forEach((variantItem) => {
        if (!witnessesString.includes(variantItem.witness.slice(0,4))) {
            // made the witness much shorter in order to show them all horizontally
            witnessesString.push(variantItem.witness.slice(0,4))
        }
      })
    })
    
    return witnessesString;
}

function handleVariantsClick() {
  console.log('clicked the variants button')
}

function handleWitnessesClick() {
  console.log('clicked the witnesses button')
}



function handleSpecificWitnessclick(witness: string) {
  // i want to differentiate whether it is about showing the variants or hiding them
  console.log('witness', witness)
}

</script>


<style scoped>

</style>