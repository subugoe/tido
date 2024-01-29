<template>
<!--  <q-inner-loading-->
<!--    class="position-absolute"-->
<!--    :class="getBackground()"-->
<!--    style="z-index: 1000"-->
<!--    :showing="true"-->
<!--  >-->
<!--    <q-spinner-->
<!--      size="3em"-->
<!--      color="primary"-->
<!--    />-->
<!--  </q-inner-loading>-->
  <ProgressSpinner />
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="15" stroke-dashoffset="15" stroke-linecap="round" stroke-width="2" d="M12 3C16.9706 3 21 7.02944 21 12"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="15;0"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
</template>

<script setup>
import ProgressSpinner from 'primevue/progressspinner';

const props = defineProps({
  background: String,
});

function getBackground() {
  if (props.background === 'none') return 'bg-transparent';
  return props.background;
}
</script>
