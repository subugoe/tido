<template>
  <q-toolbar>
    <div
      bordered
      class="row justify-start items-center"
      reveal
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-secondary text-primary'"
    >
      <Language v-if="standalone" />
      <Color :projectcolors="projectcolors" />
      <Softwareinfo />
    </div>
  </q-toolbar>
</template>

<script>
import Color from '@/components/color.vue';
import Language from '@/components/language.vue';
import Softwareinfo from '@/components/softwareinfo.vue';

export default {
  name: 'Footer',
  components: {
    Color,
    Language,
    Softwareinfo,
  },
  props: {
    projectcolors: {
      type: Object,
      default: () => {},
    },
    standalone: Boolean,
  },
};
</script>
