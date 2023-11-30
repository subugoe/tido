<template>
  <q-inner-loading
    class="position-absolute"
    :class="getBackground()"
    style="z-index: 1000"
    :showing="true"
  >
    <q-spinner
      size="3em"
      color="primary"
    />
  </q-inner-loading>
</template>

<script setup>
import { useQuasar } from 'quasar';

const props = defineProps({
  background: String,
});

const $q = useQuasar();

function getBackground() {
  if (!props.background) return $q.dark.isActive ? 'bg-grey-9' : 'bg-white';
  if (props.background === 'none') return 'bg-transparent';
  return props.background;
}
</script>
