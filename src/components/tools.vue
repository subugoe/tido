<template>
  <div class="row no-wrap justify-end">
    <Language
      v-if="config['language-switch']"
      :config="config"
    />

    <Color
      v-if="config.themes && projectColorsSet"
      :projectcolors="projectcolors"
      :config="config"
    />

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
  },
  computed: {
    projectColorsSet() {
      return !!Object.values(this.projectcolors).every((color) => color !== null && color !== '');
    },
  },
};
</script>
