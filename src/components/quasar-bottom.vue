<template>
  <div class="bottom">
    <q-separator />
    <Language />
  </div>
</template>

<script>
import Language from '@/components/language.vue';

export default {
  name: 'Bottom',
  components: {
    Language,
  },
};
</script>

<style>
.bottom {
  background: white;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 999;
}
</style>
