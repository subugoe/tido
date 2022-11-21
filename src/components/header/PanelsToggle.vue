<template>
  <div class="panels-toggle relative-position">
    <q-btn-dropdown
      v-if="$q.screen.width < 1200"
      :dropdown-icon="dropdownIcon"
      outline
      flat
      size="12px"
      padding="xs"
      class="button__dropdown q-px-sm"
      :class="$q.dark.isActive ? 'bg-black' : 'bg-secondary text-black'"
      :label="$t('show_hide_panels')"
    >
      <div class="q-pa-sm">
        <div v-for="({ show, label }, i) in toggles" :key="`toggle${i}`" class="q-py-sm">
          <q-checkbox
          :model-value="show"
          @update:model-value="update(i, $event)"
          class="q-px-sm text-body2"
          :title="handleToggleTitle(i)"
          :label="$t(label)"
          dense
          size="xs"
          :checked-icon="checkedIcon"
          :unchecked-icon="uncheckedIcon"
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
          :icon="resetIcon"
          color="primary"
        >
          <span :class="$q.dark.isActive ? 'text-light' : 'text-dark'">{{ $t('reset') }}</span>
        </q-btn>
      </div>
    </q-btn-dropdown>

    <div v-if="$q.screen.width > 1199" class="t-row t-align-center">
      <div v-for="({ show, label }, i) in toggles" :key="`toggle${i}`" class="q-px-xs">
        <q-checkbox
          :model-value="show"
          @update:model-value="update(i, $event)"
          class="q-px-sm text-body2"
          :title="handleToggleTitle(i)"
          :label="$t(label)"
          dense
          size="xs"
          :checked-icon="checkedIcon"
          :unchecked-icon="uncheckedIcon"
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
        :icon="resetIcon"
        color="primary"
      >
        <span :class="$q.dark.isActive ? 'text-light' : 'text-dark'">{{ $t('reset') }}</span>
      </q-btn>
    </div>
  </div>
</template>

<script>
import {
  biCheckCircleFill, biCircle, biArrowCounterclockwise, biChevronDown,
} from '@quasar/extras/bootstrap-icons';

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
  created() {
    this.checkedIcon = biCheckCircleFill;
    this.uncheckedIcon = biCircle;
    this.resetIcon = biArrowCounterclockwise;
    this.dropdownIcon = biChevronDown;
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
  },
};
</script>
<style lang="scss">

.reset-btn .q-icon {
  font-size: 1.2rem;
  padding-right: 0.5rem;
}
</style>
