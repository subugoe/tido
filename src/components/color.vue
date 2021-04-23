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
            <q-item-section>Default</q-item-section>
          </q-item>
          <q-item
            v-if="colorsSet"
            v-close-popup
            clickable
            @click="changeColorsTo('tido')"
          >
            <q-item-section>TiDO</q-item-section>
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
  computed: {
    colorsSet() {
      return this.projectcolors.primary && this.projectcolors.secondary && this.projectcolors.accent;
    },
  },
  created() {
    this.fasPalette = fasPalette;
  },
  methods: {
    // FIXME: refactor
    changeColorsTo(color) {
      switch (color) {
        case 'tido':
          colors.setBrand('primary', this.$q.config.brand.primary);
          colors.setBrand('secondary', this.$q.config.brand.secondary);
          colors.setBrand('accent', this.$q.config.brand.accent);
          break;
        case 'unicorn':
          colors.setBrand('primary', 'purple');
          colors.setBrand('secondary', 'lightgrey');
          colors.setBrand('accent', 'hotpink');
          break;
        default:
          if (this.colorsSet) {
            colors.setBrand('primary', this.projectcolors.primary);
            colors.setBrand('secondary', this.projectcolors.secondary);
            colors.setBrand('accent', this.projectcolors.accent);
          } else {
            colors.setBrand('primary', this.$q.config.brand.primary);
            colors.setBrand('secondary', this.$q.config.brand.secondary);
            colors.setBrand('accent', this.$q.config.brand.accent);
          }
          break;
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
