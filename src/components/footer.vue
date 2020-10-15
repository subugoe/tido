<template>
  <q-footer
    bordered
    reveal
    class="row justify-start items-center"
    :class="$q.dark.isActive ? 'bg-dark' : 'bg-secondary text-primary'"
    >
    <Language v-if="standalone" />
    <Color :projectcolors="projectcolors" />
    <Softwareinfo />
  </q-footer>
</template>

<script>
import Language from '@/components/language.vue';
import Softwareinfo from '@/components/softwareinfo.vue';
import Color from '@/components/color.vue';

export default {
  name: 'Footer',
  components: {
    Language,
    Softwareinfo,
    Color,
  },
  props: {
    standalone: Boolean,
    projectcolors: Object,
  },
};
</script>
