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

  const activeVariantsGroupedByTarget = computed(() =>
    activeVariants.value.reduce((acc, cur) => {
      cur.target
        .forEach(target => {
          const cssSelector = target.selector.value;
          if (!acc[cssSelector]) {
            acc[cssSelector] = {
              content: target.source,
              variants: [cur]
            }
          } else {
            acc[cssSelector].variants.push(cur)
          }
        })
      return acc
    }, {})
  )

  function getWitnessColor(witness: string) {
    return annotationStore.variantItemsColors[witness];
  }
</script>

<template>
  <div class="t-space-y-4">
    <div
      v-for="(selector, i) in Object.keys(activeVariantsGroupedByTarget)"
      :key="i"
      class="t-flex t-space-x-2 t-min-h-[100px] t-overflow-x-auto"
    >
      <div
        class="t-border t-rounded-md t-min-w-[16rem] t-p-4"
      >
        <h3 class="t-font-semibold t-mb-2">
          {{ $t('original') }}
        </h3>
        <p>{{ activeVariantsGroupedByTarget[selector].content }}</p>
      </div>
      <div
        v-for="(variant, i) in activeVariantsGroupedByTarget[selector].variants"
        :key="i"
        class="t-border t-rounded-md t-min-w-[16rem] t-p-4"
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
  </div>
</template>
