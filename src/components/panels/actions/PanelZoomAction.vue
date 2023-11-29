<template>
  <div class="panel-zoom-action items-center flex justify-end">
    <q-btn
      flat
      round
      :icon="zoomInIcon"
      size="sm"
      :disable="disableIncrease"
      :title="$t('increase')"
      :color="$q.dark.isActive ? 'white' : 'primary'"
      @click="increase()"
    >
    </q-btn>

    <q-btn
      flat
      round
      :icon="zoomOutIcon"
      size="sm"
      :disable="disableDecrease"
      :title="$t('decrease')"
      :color="$q.dark.isActive ? 'white' : 'primary'"
      @click="decrease()"
    >
    </q-btn>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { biZoomIn, biZoomOut } from '@quasar/extras/bootstrap-icons';

const props = defineProps({
  min: Number,
  max: Number,
  step: Number,
  startValue: Number,
});
const emit = defineEmits(['update']);

const zoomInIcon = biZoomIn;
const zoomOutIcon = biZoomOut;

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
.q-btn {
  flex-basis: 0%;
}

.panel-zoom-action {
  margin-right: -6px;
}
</style>
