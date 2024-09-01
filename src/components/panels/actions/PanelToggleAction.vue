<template>
  <div class="t-flex t-items-center">
    <label
      for="panel-toggle-action"
      class="t-mr-2 t-text-sm t-cursor-pointer"
      @click="selectedModel = !selectedModel"
    >{{ label }}</label>
    <ToggleButton
      id="panel-toggle-action"
      v-model="selectedModel"
      on-label="On"
      off-label="Off"
      :pt="{
        root: ({ props, context }) => ({
          class: [
            't-relative t-inline-flex t-w-16',
          ]
        }),
        box: ({ props, context }) => ({
          class: [
            't-relative t-pointer-events-none t-flex-1 t-bg-gray-200 t-outline-transparent t-border t-border-gray-200 t-rounded-md t-py-1 t-px-3',
            't-inline-flex t-items-center t-overflow-hidden t-text-center t-select-none',
            'before:t-absolute before:t-left-1 before:t-top-1 before:t-z-1 before:t-w-[calc(100%-0.5rem)] before:t-h-[calc(100%-0.5rem)] before:t-rounded-[4px] before:t-transition-all before:t-shadow-xsm',
            't-transition-all t-duration-200',
            't-text-gray-500',
            {
              'before:t-bg-white': props.modelValue
            },
          ]
        }),
        label: 't-relative t-flex-1 t-font-semibold t-text-sm',
        input: 't-w-full t-h-full t-absolute t-appearance-none t-cursor-pointer',
        content: '',
      }"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import ToggleButton from 'primevue/togglebutton';

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
