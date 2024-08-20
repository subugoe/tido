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
  <div
    v-for="(variant, i) in activeVariants"
    :key="i"
  >
    <h3>{{ variant.body.value.witness }}</h3>
    <p>{{ variant.body.value.entry }}</p>
  </div>
</template>
