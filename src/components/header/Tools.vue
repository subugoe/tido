<template>
  <div class="row no-wrap justify-end">
    <Language v-if="showLanguageSwitch" />
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
import Language from 'components/header/Language.vue';
import SoftwareInfo from 'components/header/SoftwareInfo.vue';

export default {
  name: 'Tools',
  components: {
    Language,
    SoftwareInfo,
  },
  computed: {
    config() {
      return this.$store.getters['config/config'];
    },
    showLanguageSwitch() {
      return this.config.header?.languageSwitch !== undefined ? this.config.header?.languageSwitch : true;
    },
  },
};
</script>
