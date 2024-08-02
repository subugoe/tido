<template>
    <button :id="'wit-chip-in-top-bar-'+index.toString()" class="t-relative t-rounded-3xl t-box-border t-bg-neutral-300 t-w-75 t-h-8 t-border-2 t-p-[2px] t-ml-[15px]" 
           :style="{'border-color': getItemColorBasedOnIndex(index)}"  @click="handleClick()"> {{ props.witness }} </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getItemColorBasedOnIndex } from '@/utils/color';

export interface Props {
  witness: string,
  variantAnnotations: Annotation[],
  index: number
}

const props = withDefaults(defineProps<Props>(), {
  witness: () => <string>'',
  variantAnnotations: () => <Annotation[]>[],
  index: () => <number>0,
})

let checked = ref(true);


function handleClick() {
    const witChipButtonEl = document.getElementById("wit-chip-in-top-bar-"+props.index.toString())
    checked.value = !checked.value
    toggleButtonColor(checked.value, witChipButtonEl)
    toggleVariantItems(checked.value)
    toggleHighlightedText(checked.value)
}

function toggleButtonColor(checked: boolean, witChipButtonEl) {
    if (checked === false) {
        // change the background color value in the button to white
        witChipButtonEl.classList.replace("t-bg-neutral-300", "t-bg-white")
    }
    else {
        witChipButtonEl.classList.replace("t-bg-white", "t-bg-neutral-300");
    }
}

function toggleVariantItems(checked: boolean) {
    const variantsAnnotationsinTab = document.getElementsByClassName('variants-annotation')
    Array.from(variantsAnnotationsinTab).forEach((variantsAnnotation) => {
        Array.from(variantsAnnotation.children).forEach((variantItem) => {
            let spanElement = variantItem.getElementsByTagName("span")[0]
            if(spanElement.innerHTML.includes(props.witness)) {
                if (checked) {
                    variantItem.classList.replace('t-hidden', 't-block')
                }
                else {
                    variantItem.classList.add('t-hidden')
                }
            }
       })
   })
}


function toggleHighlightedText(checked: boolean) {

    
    // get the selectors on the text for which there is a variant in our witness
    const selectorsAnnotated: string [] =  getSelectorsAnnotated()

    if (selectorsAnnotated.length > 0) {
        selectorsAnnotated.forEach((selector) => {
            const spanElement = document.querySelector(selector)
            if (checked === true) {
                spanElement.classList.replace('t-hidden', 't-inline')
             }
            else {
                spanElement.classList.add('t-hidden')
            }
            })
        
    } 
}

function getSelectorsAnnotated(): string[] {
    let selectorsAnnotated: string[] = []
    props.variantAnnotations.forEach((variantAnnotation) => {
        if (isWitnessOnThisAnnotation(variantAnnotation) === true) {
            selectorsAnnotated.push(variantAnnotation.target[0].selector.value)
        }
    })

    return selectorsAnnotated
}

function isWitnessOnThisAnnotation(variantAnnotation): boolean {
    let isWitnessOnAnnotation = false
    variantAnnotation.body.value.forEach((variantItem) => {
        if (variantItem.witness.includes(props.witness)) isWitnessOnAnnotation = true
    })
    return isWitnessOnAnnotation
}


</script>

<style scoped>

</style>