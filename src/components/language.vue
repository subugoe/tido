<template>
  <div class="col-xs-auto">
    <q-btn
      color="grey"
      flat
      title="Change language"
      >
      <q-icon
        size="md"
        :name="fasLanguage"
      />

      <q-menu
        anchor="center middle"
        fit
        self="center middle"
        >
        <!-- FIXME: remove inline style -->
        <q-list style="min-width: 100px;">
          <q-item clickable v-close-popup>
            <q-item-section>EN</q-item-section>
          </q-item>

          <q-item clickable v-close-popup>
            <q-item-section>DE</q-item-section>
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
  created() {
    this.fasLanguage = fasLanguage;
  },
};
</script>
