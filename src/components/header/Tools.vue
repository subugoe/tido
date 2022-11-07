<template>
  <div class="row no-wrap justify-end">
    <Language v-if="showLanguageSwitch" />
    <Color v-if="config.themes" :projectcolors="projectcolors" :config="config" />
    <q-btn
      flat
      round
      :color="$q.dark.isActive ? 'yellow-4': 'grey-5'"
      :icon="$q.dark.isActive ? 'bi-moon-fill': 'bi-sun-fill'"
      @click="$q.dark.toggle()"
    ></q-btn>
    <SoftwareInfo />
  </div>
</template>

<script>
import Color from 'components/Color.vue';
import Language from 'components/header/Language.vue';
import SoftwareInfo from 'components/SoftwareInfo.vue';

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
    showLanguageSwitch() {
      return this.config.header?.languageSwitch !== undefined ? this.config.header?.languageSwitch : true;
    },
  },
};
</script>
