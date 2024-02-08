<template>
  <div class="panel-zoom-action t-items-center t-flex t-space-x-2">
    <BaseButton
      display="flat"
      rounded
      icon="zoomIn"
      size="small"
      :disable="disableIncrease"
      :title="$t('increase')"
      class="t-text-primary dark:t-text-gray-400"
      @click="increase()"
    >
    </BaseButton>

    <BaseButton
      display="flat"
      rounded
      icon="zoomOut"
      size="small"
      :disable="disableDecrease"
      :title="$t('decrease')"
      class="t-text-primary dark:t-text-gray-400"
      @click="decrease()"
    >
    </BaseButton>
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
});

function increase() {
  value.value += props.step;
  emit('update', value.value);

  if (value.value >= props.max) {
    disableIncrease.value = true;
  } else {
    disableIncrease.value = false;
    disableDecrease.value = false;
  }
}

function decrease() {
  value.value -= props.step;
  emit('update', value.value);

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
