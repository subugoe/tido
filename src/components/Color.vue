<template>
  <div class="colors">
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
            v-for="theme in themes"
            :key="theme.value"
            v-close-popup
            clickable
            :class="{'theme': selectedTheme === theme.value}"
            @click="changeColorsTo(theme.value)"
          >
            <q-item-section>
              {{ theme.label }}
            </q-item-section>
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
    config: {
      type: Object,
      default: () => {},
    },
    projectcolors: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    themes: [
      { label: 'Default', value: 'default' },
      { label: 'TIDO', value: 'tido' },
    ],
    selectedTheme: '',
  }),
  mounted() {
    if (this.config.themes) {
      this.selectedTheme = 'tido';
    }
  },
  created() {
    this.fasPalette = fasPalette;
  },
  methods: {
    changeColorsTo(color) {
      this.selectedTheme = color;

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

.theme {
  background-color: $grey-5;
}
</style>
