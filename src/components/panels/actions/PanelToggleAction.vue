<template>
  <div class="flex items-center justify-end">
    <q-checkbox indeterminate-value="maybe" v-model="selectedModel" :label="label" dense size="xs" />
  </div>
</template>

<script>
export default {
  name: 'PanelToggleAction',
  // props: {
  //   selected: Boolean,
  //   label: String,
  // },
  // data: () => ({
  //   selectedModel: false,
  // }),
  // watch: {
  //   selected: {
  //     handler(value) {
  //       this.selectedModel = value;
  //     },
  //     immediate: true,
  //   },
  //   selectedModel(value, oldValue) {
  //     if (value !== oldValue) this.$emit('update', value);
  //   },
  // },
}
</script>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  selected: Boolean,
  label: String,
})
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

<style scoped>
.q-btn {
  flex-basis: 0%;
}
</style>
