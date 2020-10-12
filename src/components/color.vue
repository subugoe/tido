<template>
  <div class="col-xs-auto colors">
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
          <q-item
            clickable
            @click="() => changeColorsTo('default')"
            v-close-popup
            >
            <q-item-section>Default</q-item-section>
          </q-item>

          <!--
          <q-item
            clickable
            @click="() => changeColorsTo('dark')"
            v-close-popup
            >
            <q-item-section>Contrast Mode</q-item-section>
          </q-item>
          -->

          <q-item
            clickable
            @click="() => changeColorsTo('unicorn')"
            v-close-popup
            >
            <q-item-section>Unicorn</q-item-section>
          </q-item>

        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
import { fasPalette } from '@quasar/extras/fontawesome-v5';
import { colors } from 'quasar';

export default {
  name: 'color',
  created() {
    this.fasPalette = fasPalette;
  },
  methods: {
    changeColorsTo(color) {
      console.log(this.$q.dark.isActive);
      if (color === 'default') {
        // this.$q.dark.set(false);
        if (this.$q.dark.isActive === false) {
          colors.setBrand('primary', this.$q.config.brand.primary);
          colors.setBrand('secondary', this.$q.config.brand.secondary);
          colors.setBrand('accent', this.$q.config.brand.accent);
        }
      }
      // if (color === 'dark') {
      //   this.$q.dark.set(true);
      // }
      if (color === 'unicorn') {
        if (this.$q.dark.isActive === false) {
          // this.$q.dark.set(false);
          colors.setBrand('primary', 'purple');
          colors.setBrand('secondary', 'lightgrey');
          colors.setBrand('accent', 'hotpink');
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.colors {
  @media (prefers-color-scheme: dark) {
    display: none;
  }
}
</style>
