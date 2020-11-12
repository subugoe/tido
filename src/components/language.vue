<template>
  <div class="col-xs-auto">
    <q-select
      v-model="lang"
      label="Change language"
      :options="langs"
    >
      <q-icon
        :name="fasLanguage"
        size="md"
      />
    </q-select>
    {{ $t('view') }}
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
      lang: this.$i18n.locale,
    };
  },
  watch: {
    lang(lang) {
      this.$i18n.locale = lang.value;
      this.$q.lang.set(lang.value);
      // eslint-disable-next-line
      console.log(lang);

      // import(`quasar/lang/${lang.value}`).then(language => {
      //   this.$q.lang.set(language.default);
      // });
    },
  },
  created() {
    this.fasLanguage = fasLanguage;
  },
};
</script>
