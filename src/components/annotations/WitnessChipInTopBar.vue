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
   //toggleHighlitedText(checked.value)

    // TODO: add a function to: highlight/dehighlight the text passage which is witnessed from this manuscript
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



</script>

<style scoped>

</style>