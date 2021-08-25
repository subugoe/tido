<template>
  <div class="col-xs-auto colors">
    <q-btn
      flat
      :title="$t('colorScheme')"
    >
      <q-icon
        :name="fasPalette"
        size="xs"
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
            @click="changeColorsTo('default')"
          >
            <q-item-section>{{ $t('default') }}</q-item-section>
          </q-item>

          <q-item
            v-if="projectcolors.primary && projectcolors.secondary && projectcolors.accent"
            v-close-popup
            clickable
            @click="changeColorsTo('tido')"
          >
            <q-item-section>TIDO</q-item-section>
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
        colors.setBrand('primary', this.$q.config.brand.primary);
        colors.setBrand('secondary', this.$q.config.brand.secondary);
        colors.setBrand('accent', this.$q.config.brand.accent);
      } else if (color === 'tido' && this.projectcolors.primary && this.projectcolors.secondary && this.projectcolors.accent) {
        colors.setBrand('primary', this.projectcolors.primary);
        colors.setBrand('secondary', this.projectcolors.secondary);
        colors.setBrand('accent', this.projectcolors.accent);
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
