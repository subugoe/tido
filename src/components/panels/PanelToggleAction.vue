<template>
  <div class="flex items-center">
    <q-checkbox indeterminate-value="maybe" v-model="selectedModel" label="Alle auswählen" dense size="xs" />
  </div>
</template>

<script>
export default {
  name: 'PanelToggleAction',
  props: {
    selected: Boolean,
  },
  data: () => ({
    selectedModel: false
  }),
  watch: {
    selected: {
      handler(value, oldValue) {
        this.selectedModel = value;
      },
      immediate: true
    },
    selectedModel(value, oldValue) {
      if (value !== oldValue)
        this.$emit('update', value);
    }
  },
  // mounted() {
  //   this.selectedModel = false;
  // }
}
</script>

<!--<script setup>-->
<!--import { ref, defineEmits, watch, onMounted } from 'vue';-->

<!--const emit = defineEmits(['update']);-->
<!--const props = defineProps(['selected', 'watcher'])-->
<!--const selectedModel = ref(false);-->

<!--watch(props.selected, (selected) => {-->
<!--  console.log(selected);-->
<!--  selectedModel.value = selected;-->
<!--});-->

<!--onMounted(() => {-->
<!--  selectedModel.value = props.selected;-->
<!--});-->

<!--watch(selectedModel, (selected) => {-->
<!--  console.log(selected);-->
<!--  emit('update', selected);-->
<!--});-->
<!--</script>-->

<style scoped>
</style>
