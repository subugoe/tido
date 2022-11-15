<template>
  <div class="panels-toggle">
    <q-btn-dropdown
      v-if="$q.screen.width < 1200"
      :dropdown-icon="fasCaretDown"
      outline
      flat
      size="12px"
      padding="xs"
      class="button__dropdown q-px-sm"
      :class="$q.dark.isActive ? 'bg-black' : 'bg-secondary text-black'"
      :label="$t('show_hide_panels')"
    >
      <q-list v-for="(p, i) in panels" :key="`toggle${i}`">
        <q-item
          v-if="p.toggle"
          clickable
          padding="xs"
          :title="handleToggleTitle(i)"
          @click="() => handleStatusPanel(i)"

        >
          <q-item-section>
            <q-item-label>
              <q-icon
                class="q-pr-xs"
                size="xs"
                :color="$q.dark.isActive ? 'bg-black' : 'primary'"
                :name="renderCheckIcon(i)"
              />
              <span :class="$q.dark.isActive ? 'text-light' : 'text-dark'">{{ $t(p.label) }}</span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-list>
        <q-item
          v-if="toggleCounter"
          v-close-popup
          clickable
          padding="xs"
          :title="$t('reset_view')"
          @click="() => handleStatusPanel(-1, true)"
        >
          <q-item-section>
            <q-item-label>
              <q-icon
                class="q-pr-xs"
                size="xs"
                :color="$q.dark.isActive ? 'white' : 'primary'"
                :name="fasUndo"
              />
              <span :class="$q.dark.isActive ? 'text-light' : 'text-dark'">{{ $t('reset').toUpperCase() }}</span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <div v-if="$q.screen.width > 1199" class="row">
      <div v-for="({ show, label }, i) in toggles" :key="`toggle${i}`" class="q-px-xs">
        <q-checkbox
          :model-value="show"
          @update:model-value="update(i, $event)"
          class="q-px-sm text-body2"
          :title="handleToggleTitle(i)"
          :label="$t(label)"
          dense
          size="xs"
          checked-icon="bi-check-circle-fill"
          unchecked-icon="bi-circle"
        >
        </q-checkbox>
      </div>

      <q-btn
        v-if="toggles.length > 0"
        flat
        no-caps
        dense
        class="q-px-sm q-py-none reset-btn"
        :title="$t('reset_view')"
        @click="reset"
        icon="bi-arrow-counterclockwise"
        color="primary"
      >
        <span :class="$q.dark.isActive ? 'text-light' : 'text-dark'">{{ $t('reset') }}</span>
      </q-btn>
    </div>
  </div>
</template>

<script>
import { icon } from 'src/utils/icon';

export default {
  name: 'PanelsToggle',
  data: () => ({
    toggles: [],
  }),
  computed: {
    panels() {
      return this.$store.getters['config/config'].panels;
    },
  },
  watch: {
    panels: {
      handler(value) {
        this.toggles = value
          .filter(({ toggle }) => toggle === true)
          .map(({ show, label }, index) => ({ index, show, label }));
      },
      immediate: true,
    },
  },
  methods: {
    update(index, show) {
      this.toggles[index].show = show;
      this.$store.dispatch('config/setShowPanel', { index, show });
    },

    reset() {
      this.toggles.forEach((toggle, index) => {
        this.toggles[index].show = true;
        this.$store.dispatch('config/setShowPanel', { index, show: true });
      });
    },

    // display toggle title when hovering
    handleToggleTitle(idx) {
      const titleName = this.$t(this.toggles[idx].label);
      const titleUpper = `${titleName[0].toUpperCase()}${titleName.slice(1)}`;

      return this.toggles[idx].show
        ? `${this.$t('hide')} ${titleUpper} Panel`
        : `${this.$t('show')} ${titleUpper} Panel`;
    },
    icon(name) {
      return icon(name);
    },
  },
};
</script>
<style lang="scss">

.reset-btn .q-icon {
  font-size: 1.2rem;
  padding-right: 0.5rem;
}
</style>
