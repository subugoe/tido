<template>
  <div class="col-xs-auto">
    <q-btn
      flat
      title="Change color"
      >
      <q-icon
        :name="fasPalette"
        size="xs"
      />

      <q-menu
        anchor="center middle"
        fit
        self="center middle"
        >
        <q-list>
          <q-item clickable v-close-popup>
            <q-item-section>default</q-item-section>
          </q-item>

          <q-item clickable v-close-popup>
            <q-item-section>asdf</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
import { fasPalette } from '@quasar/extras/fontawesome-v5';
// import { colors } from 'quasar';

// colors.setBrand('primary', 'purple');
// colors.setBrand('secondary', 'lightgrey');
// colors.setBrand('accent', 'hotpink');

export default {
  name: 'color',
  created() {
    this.fasPalette = fasPalette;
  },
};
</script>
