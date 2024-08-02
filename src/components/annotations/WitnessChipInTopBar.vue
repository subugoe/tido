<template>
    <button :id="'wit-chip-in-top-bar-'+index.toString()" class="t-relative t-rounded-3xl t-box-border t-bg-neutral-300 t-w-75 t-h-8 t-border-2 t-p-[2px] t-ml-[15px]" 
           :style="{'border-color': getItemColorBasedOnIndex(index)}"  @click="handleClick()"> {{ props.witness }} </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getItemColorBasedOnIndex } from '@/utils/color';

export interface Props {
  witness: string,
  index: number
}

const props = withDefaults(defineProps<Props>(), {
  witness: () => <string>'',
  index: () => <number>0,
})

let checked = ref(true);


function handleClick() {
    const witChipButtonEl = document.getElementById("wit-chip-in-top-bar-"+props.index.toString())
    checked.value = !checked.value
    // TODO: create another function - toggleButton color(add as argument the 'checked.value')
    if (checked.value === false) {
        // change the background color value in the button to white
        witChipButtonEl.classList.replace("t-bg-neutral-300", "t-bg-white")
    }
    else {
        document.getElementById("wit-chip-in-top-bar-"+props.index.toString()).classList.replace("t-bg-white", "t-bg-neutral-300");
    }

    // TODO: add a function to: show or hide the variant items which are witnessed from this manuscript
    // TODO: add a function to: highlight/dehighlight the text passage which is witnessed from this manuscript
}

</script>

<style scoped>

</style>