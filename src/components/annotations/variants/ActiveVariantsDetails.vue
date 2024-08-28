<script setup lang="ts">
  import { useAnnotationsStore } from "@/stores/annotations";
  import {computed} from "vue";
  import colors from "tailwindcss/colors";

  const annotationStore = useAnnotationsStore();

  const activeVariants = computed(() => {
    const activeAnnotations = annotationStore.activeAnnotations
    return Object.keys(activeAnnotations)
      .filter(id => activeAnnotations[id].body['x-content-type'] === 'Variant')
      .map(id => activeAnnotations[id])
  });

  function getWitnessColor(witness: string) {
    return annotationStore.variantItemsColors[witness];
  }
</script>

<template>
  <div class="t-flex t-space-x-2 t-min-h-[200px] t-overflow-x-auto">
    <div
      v-if="activeVariants.length > 0"
      class="t-border t-rounded-md t-min-w-[16rem] t-flex-1 t-p-4"
    >
      <h3 class="t-font-semibold t-mb-2">
        {{ $t('original') }}
      </h3>
      <p>{{ activeVariants[0].target[0].source }}</p>
    </div>
    <div
      v-for="(variant, i) in activeVariants"
      :key="i"
      class="t-border t-rounded-md t-min-w-[16rem] t-flex-1 t-p-4"
    >
      <h3 class="t-font-semibold t-mb-2 t-flex t-whitespace-nowrap">
        <span
          class="t-rounded-full t-h-3 t-w-3 t-mt-1.5 t-mr-2 t-flex-shrink-0"
          :style="{
            'background': colors[getWitnessColor(variant.body.value.witness)]['500'],
          }"
        />
        {{ variant.body.value.witness }}
      </h3>
      <p>{{ variant.body.value.entry }}</p>
    </div>
  </div>
</template>
