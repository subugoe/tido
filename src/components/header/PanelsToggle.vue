<template>
  <div class="panels-toggle relative-position">
    <q-btn
      v-if="$q.screen.width < 1200"
      :icon-right="dropdownIcon"
      :label="$t('show_hide_panels')"
      outline
      flat
      size="12px"
      @click="showDropdown = !showDropdown"
    >
    </q-btn>
    <div
      v-if="showDropdown"
      class="dropdown-list shadow-2 rounded-borders"
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-white text-dark'"
    >
      <q-list v-click-outside="onDropdownClickOutside">
        <q-item v-for="({ show, label }, i) in toggles" :key="`toggle${i}`" class="q-pl-xs q-py-none" tag="label" v-ripple>
          <q-item-section side>
            <q-checkbox
              :model-value="show"
              @update:model-value="update(i, $event)"
              :checked-icon="checkedIcon"
              :unchecked-icon="uncheckedIcon"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t(label) }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item tag="label" v-ripple @click="reset">
          <q-item-section side>
            <q-icon :name="resetIcon"></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('reset') }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div v-if="$q.screen.width > 1199" class="row items-center">
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
    showDropdown: false,
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
    onDropdownClickOutside() {
      this.showDropdown = false;
      console.log('yo');
    },
  },
};
</script>
<style lang="scss">

.dropdown-list {
  position: absolute;
  z-index: 1000;
  top: calc(100% + 0.5rem);
}
.reset-btn .q-icon {
  font-size: 1.2rem;
  padding-right: 0.5rem;
}

.panels-toggle.col {
  width: unset !important;
  padding: unset !important;
}

:deep(.q-checkbox) {
  flex-shrink: unset !important;
  width: unset !important;
  max-width: unset !important;
}
</style>
