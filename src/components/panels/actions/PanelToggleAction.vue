<template>
  <div class="t-flex t-items-center">
    <BaseCheckbox id="panel-toggle-action" tri-state v-model="selectedModel" />
    <label for="panel-toggle-action" class="t-ml-2 t-text-sm">{{ label }}</label>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import BaseCheckbox from '@/components/base/BaseCheckbox.vue';

const props = defineProps({
  selected: Boolean,
  label: String,
});
const emit = defineEmits(['update']);

const selectedModel = ref(false);

watch(
  () => props.selected,
  (value) => {
    selectedModel.value = value;
  },
  { immediate: true },
);

watch(
  selectedModel,
  (value, oldValue) => {
    if (value !== oldValue) {
      emit('update', value);
    }
  },
);
</script>
