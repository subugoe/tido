<template>
  <div class="col-xs-auto">
    <q-btn color="grey-5" flat :title="$t('change_language')" icon="bi-translate">
      <q-menu anchor="center middle" fit self="center middle">
        <q-list>
          <q-item
            v-for="lang in langs"
            :key="lang.value"
            v-close-popup
            clickable
            :class="{ language: selectedLang === lang.value }"
            @click="handleLanguageChange(lang)"
          >
            <q-item-section>{{ lang.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'Language',
  data() {
    return {
      langs: [
        { label: 'DE', value: 'de-de' },
        { label: 'EN', value: 'en-US' },
      ],
      selectedLang: 'en-US',
    };
  },
  watch: {
    selectedLang(lang) {
      this.$i18n.locale = lang;
    },
  },
  mounted() {
    this.selectedLang = this.config.lang || 'en-US';
  },
  computed: {
    config() {
      return this.$store.getters['config/config'];
    },
  },
  methods: {
    handleLanguageChange(lang) {
      this.selectedLang = lang.value;
    },
  },
};
</script>

<style lang="scss">
.language {
  background-color: $grey-5;
}
</style>
