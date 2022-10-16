<template>
  <div class="flex items-center">
    <q-checkbox indeterminate-value="maybe" v-model="selectedModel" label="Alle auswählen" dense size="xs" />
  </div>
</template>

<script setup>
import { ref, defineEmits, watch, onMounted } from 'vue';

const emit = defineEmits(['update']);
const props = defineProps(['selected'])
const selectedModel = ref(false);

watch(props.selected, (selected) => {
  console.log(selected);
  selectedModel.value = selected;
});

onMounted(() => {
  selectedModel.value = props.selected;
});

watch(selectedModel, (selected) => {
  console.log(selected);
  emit('update', selected);
});


</script>

<style scoped>
</style>
