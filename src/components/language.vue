<template>
  <div class="col-xs-auto">
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
  data() {
    return {
      langs: [
        { label: 'DE', value: 'de' },
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

<style>
.language {
  background-color: #808080;
}
</style>
