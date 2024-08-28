<script setup lang="ts">
import {useAnnotationsStore} from "@/stores/annotations.js";
import {computed} from "vue";
import colors from "tailwindcss/colors";

const annotationsStore = useAnnotationsStore()

const witnesses = computed(() => annotationsStore.witnesses)

function getWitnessColor(witness: string) {
  return annotationsStore.variantItemsColors[witness];
}
</script>

<template>
  <div
    v-for="(witness, i) in witnesses"
    :key="i"
    class="t-flex t-flex-col t-rounded-md t-border t-mb-2 t-p-4"
  >
    <h3 class="t-font-semibold t-mb-2 t-flex t-whitespace-nowrap">
      <span
        class="t-rounded-full t-h-3 t-w-3 t-mt-1.5 t-mr-2 t-flex-shrink-0"
        :style="{
          'background': colors[getWitnessColor(witness.idno)]['500'],
        }"
      />
      {{ witness.idno }}
    </h3>
    <p>test</p>
  </div>
</template>
