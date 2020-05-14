<template>
  <q-footer bordered reveal class="bg-white">
    <Language />
  </q-footer>
</template>

<script>
import Language from '@/components/language.vue';

export default {
  name: 'Footer',
  components: {
    Language,
  },
};
</script>
