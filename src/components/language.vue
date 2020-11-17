<template>
  <div class="col-xs-auto">
    <q-select
      v-model="lang"
      :color="$q.dark.isActive ? 'white' : 'accent'"
      :options="langs"
    >
      <template #prepend>
        <q-icon
          :name="fasLanguage"
          size="md"
        />
      </template>
    </q-select>
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
      lang: 'EN',
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
