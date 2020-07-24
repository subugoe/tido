<template>
  <q-footer bordered reveal class="bg-white row justify-start items-center ">
    <Language v-if="standalone" />
    <Softwareinfo />
  </q-footer>
</template>

<script>
import Language from '@/components/language.vue';
import Softwareinfo from '@/components/softwareinfo.vue';

export default {
  name: 'Footer',
  components: {
    Language,
    Softwareinfo,
  },
  props: {
    standalone: Boolean,
  },
};
</script>
