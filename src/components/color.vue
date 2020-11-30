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
            v-close-popup
            clickable
            @click="changeColorsTo('default')"
          >
            <q-item-section>{{ $t('default') }}</q-item-section>
          </q-item>
          <q-item
            v-if="projectcolors.primary && projectcolors.secondary && projectcolors.accent"
            v-close-popup
            clickable
            @click="changeColorsTo('emo')"
          >
            <q-item-section>EMo</q-item-section>
          </q-item>
          <q-item
            v-close-popup
            clickable
            @click="changeColorsTo('unicorn')"
          >
            <q-item-section>Unicorn</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
import { colors } from 'quasar';
import { fasPalette } from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Color',
  props: {
    projectcolors: {
      type: Object,
      required: true,
    },
  },
  created() {
    this.fasPalette = fasPalette;
  },
  methods: {
    changeColorsTo(color) {
      if (color === 'default') {
        if (this.projectcolors.primary && this.projectcolors.secondary && this.projectcolors.accent) {
          colors.setBrand('primary', this.projectcolors.primary);
          colors.setBrand('secondary', this.projectcolors.secondary);
          colors.setBrand('accent', this.projectcolors.accent);
        } else {
          colors.setBrand('primary', this.$q.config.brand.primary);
          colors.setBrand('secondary', this.$q.config.brand.secondary);
          colors.setBrand('accent', this.$q.config.brand.accent);
        }
      }
      if (color === 'emo') {
        colors.setBrand('primary', this.$q.config.brand.primary);
        colors.setBrand('secondary', this.$q.config.brand.secondary);
        colors.setBrand('accent', this.$q.config.brand.accent);
      }
      if (color === 'unicorn') {
        colors.setBrand('primary', 'purple');
        colors.setBrand('secondary', 'lightgrey');
        colors.setBrand('accent', 'hotpink');
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
