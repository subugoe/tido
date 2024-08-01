<template>
    <div class="t-items-center t-flex t-mb-[30px]">
        <span v-for="(witness, i) in getWitnesses()" :key="i" class="t-relative  t-rounded-3xl t-box-border t-w-75 t-h-8 t-border-2 t-p-[2px] t-ml-[15px]" :style="{'border-color': getItemColorBasedOnIndex(i)}"> {{ witness }} </span>
    </div>

</template>

<script setup lang="ts">

import { getItemColorBasedOnIndex } from '@/utils/color'

export interface Props {
  variantAnnotations: Annotation[]
}

const props = withDefaults(defineProps<Props>(), {
  variantAnnotations: () => <Annotation[]>[],
})


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

</script>


<style scoped>

</style>