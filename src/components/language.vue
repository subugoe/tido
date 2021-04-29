<template>
  <div class="col-xs-auto">
    <q-btn
      flat
      title="Change language"
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
            v-close-popup
            clickable
          >
            <q-item-section>DE</q-item-section>
          </q-item>

          <q-item
            v-close-popup
            clickable
          >
            <q-item-section>{{ lang }}</q-item-section>
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
      lang: 'EN',
    };
  },
  created() {
    this.fasLanguage = fasLanguage;
  },
};
</script>
