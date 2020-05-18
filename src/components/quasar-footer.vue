<template>
  <q-footer bordered reveal class="bg-white">
    <Language v-if="standalone" />
  </q-footer>
</template>

<script>
import Language from '@/components/language.vue';

export default {
  name: 'Footer',
  components: {
    Language,
  },
  props: {
    standalone: Boolean,
  },
};
</script>
