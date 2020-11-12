<template>
  <div class="col-xs-auto">
    <q-select
      dense
      v-model="lang"
      :options="langs"
      options-dense
    >
      <template v-slot:prepend>
        <q-icon
          :name="fasLanguage"
          size="md"
        />
      </template>
    </q-select>

    {{ $t('view') }}
    {{ $t('textsize') }}
    {{ $t('image') }}
    {{ $t('sheet') }}
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
    },
  },
  created() {
    this.fasLanguage = fasLanguage;
  },
};
</script>
