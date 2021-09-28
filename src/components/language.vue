<template>
  <div
    v-if="config['language-switch']"
    class="col-xs-auto"
  >
    <q-btn
      flat
      :title="$t('changeLanguage')"
    >
      <q-icon
        :name="fasLanguage"
        size="md"
        :color="$q.dark.isActive ? 'bg-black' : 'accent'"
      />

      <q-menu
        anchor="center middle"
        fit
        self="center middle"
      >
        <q-list>
          <q-item
            v-for="lang in langs"
            :key="lang.value"
            v-close-popup
            clickable
            :class="{'language': selectedLang === lang.value}"
            @click="handleLanguageChange(lang)"
          >
            <q-item-section>
              {{ lang.label }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
import { fasLanguage } from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Language',
  props: {
    config: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      langs: [
        { label: 'DE', value: 'de-de' },
        { label: 'EN', value: 'en-us' },
      ],
      selectedLang: 'en-us',
    };
  },
  watch: {
    selectedLang(lang) {
      this.$i18n.locale = lang;
    },
  },
  mounted() {
    this.selectedLang = this.config.lang;
  },
  created() {
    this.fasLanguage = fasLanguage;
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
