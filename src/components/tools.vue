<template>
  <div class="row no-wrap justify-end col-xs-3">
    <Language
      v-if="standalone && config['language-switch']"
      :config="config"
    />

    <Color :projectcolors="projectcolors" />

    <Softwareinfo />
  </div>
</template>

<script>
import Color from '@/components/color.vue';
import Language from '@/components/language.vue';
import Softwareinfo from '@/components/softwareinfo.vue';

export default {
  name: 'Tools',
  components: {
    Color,
    Language,
    Softwareinfo,
  },
  props: {
    config: {
      type: Object,
      default: () => {},
    },
    projectcolors: {
      type: Object,
      default: () => {},
    },
    standalone: Boolean,
  },
};
</script>
