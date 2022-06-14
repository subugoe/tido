<template>
  <div class="row no-wrap justify-end">
    <Language
      v-if="config['language-switch']"
      :config="config"
    />

    <Color
      v-if="config.themes"
      :projectcolors="projectcolors"
      :config="config"
    />

    <SoftwareInfo />
  </div>
</template>

<script>
import Color from '@/components/Color.vue';
import Language from '@/components/Language.vue';
import SoftwareInfo from '@/components/SoftwareInfo.vue';

export default {
  name: 'Tools',
  components: {
    Color,
    Language,
    SoftwareInfo,
  },
  computed: {
    config() {
      return this.$store.getters['config/config'];
    },
    projectcolors() {
      return this.config.colors;
    },
  },
};
</script>
