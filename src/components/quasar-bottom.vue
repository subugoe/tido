<template>
  <div class="bottom">
    <q-separator />
    <Language />
    <Softwareinfo />
  </div>
</template>

<script>
import Language from '@/components/language.vue';
import Softwareinfo from '@/components/softwareinfo.vue';

export default {
  name: 'Bottom',
  components: {
    Language,
    Softwareinfo,
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
