<script setup>
  import { useAnnotationsStore } from "@/stores/annotations";
  import {computed} from "vue";

  const annotationStore = useAnnotationsStore();

  const activeVariants = computed(() => {
    const activeAnnotations = annotationStore.activeAnnotations
    return Object.keys(activeAnnotations)
      .filter(id => activeAnnotations[id].body['x-content-type'] === 'Variant')
      .map(id => activeAnnotations[id])
  });
</script>

<template>
  <div class="t-flex t-space-x-2 t-min-h-[200px]">
    <div
      v-if="activeVariants.length > 0"
      class="t-border t-rounded-md t-flex-1 t-p-2"
    >
      <h3 class="t-font-semibold mb-2">
        {{ $t('original') }}
      </h3>
      <p>{{ activeVariants[0].target.source }}</p>
    </div>
    <div
      v-for="(variant, i) in activeVariants"
      :key="i"
      class="t-border t-rounded-md t-flex-1 t-p-2"
    >
      <h3 class="t-font-semibold mb-2">{{ variant.body.value.witness }}</h3>
      <p>{{ variant.body.value.entry }}</p>
    </div>
  </div>
</template>
