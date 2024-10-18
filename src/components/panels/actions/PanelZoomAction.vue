<template>
  <div class="panel-zoom-action t-items-center t-flex">
    <BaseButton
      display="flat"
      rounded
      icon="zoomIn"
      size="small"
      :disabled="disableIncrease"
      :title="$t('increase')"
      class="t-text-primary dark:t-text-gray-400"
      @click="increase()"
    />

    <BaseButton
      display="flat"
      rounded
      icon="zoomOut"
      size="small"
      :disabled="disableDecrease"
      :title="$t('decrease')"
      class="t-text-primary dark:t-text-gray-400"
      @click="decrease()"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import BaseButton from '@/components/base/BaseButton.vue';

const props = defineProps({
  min: Number,
  max: Number,
  step: Number,
  startValue: Number,
});
const emit = defineEmits(['update']);

const disableIncrease = ref(false);
const disableDecrease = ref(false);
const value = ref(0);

onMounted(() => {
  value.value = props.startValue;
  if(value.value === props.min)  disableDecrease.value = true;
  if(value.value === props.max)  disableIncrease.value = true; 
});

function increase() {
  if(value.value + props.step <= props.max) {
    value.value += props.step;
    emit('update', value.value);
  }

  if (value.value >= props.max) {
    disableIncrease.value = true;
  } else {
    disableIncrease.value = false;
    disableDecrease.value = false;
  }
}

function decrease() {
  if(value.value - props.step >= props.min) {
    value.value -= props.step;
    emit('update', value.value);
  }

  if (value.value <= props.min) {
    disableDecrease.value = true;
  } else {
    disableIncrease.value = false;
    disableDecrease.value = false;
  }
}
</script>

<style scoped>
.panel-zoom-action {
  margin-right: -6px;
}
</style>
