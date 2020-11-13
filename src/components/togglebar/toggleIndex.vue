<template>
  <div class="q-d-flex">
    <ToggleFilter>
      <q-list class="toggle-list">
        <div
          v-for="(p, i) in panels"
          :key="`toggle${i}`"
        >
          <q-item
            v-close-popup
            clickable
            flat
            :title="handleToggleTitle(i)"
            @click="() => handleStatusPanel(i)"
          >
            <q-icon
              class="q-pr-xs"
              size="xs"
              :color="$q.dark.isActive ? 'bg-black' : 'accent'"
              :name="renderCheckIcon(i)"
            />
            {{ $t(p.panel_label).toUpperCase() }}
          </q-item>
        </div>

        <q-item
          v-close-popup
          clickable
          flat
          :title="$t('Defaultview')"
          @click="()=> handleStatusPanel(-1, true)"
        >
          <q-icon
            class="q-pr-xs"
            size="xs"
            :color="$q.dark.isActive ? 'white' : 'accent'"
            :name="fasUndo"
          />
          {{ $t('Reset').toUpperCase() }}
        </q-item>
      </q-list>
    </ToggleFilter>

    <!-- <PanelsPosition :panelboxes="panels" /> -->
  </div>
</template>

<script>
import {
  fasUndo,
  fasCircle,
  fasCheckCircle,
} from '@quasar/extras/fontawesome-v5';

// import PanelsPosition from '@/components/togglebar/panelsposition';
import ToggleFilter from '@/components/togglebar/toggleFilter.vue';

export default {
  name: 'ToggleIndex',
  components: {
    // PanelsPosition,
    ToggleFilter,
  },
  props: {
    panels: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    // mount the fonts
    this.fasCheckCircle = fasCheckCircle;
    this.fasCircle = fasCircle;
    this.fasUndo = fasUndo;
  },
  methods: {
    // show checkbox icon depending on the current status
    renderCheckIcon(idx) {
      return this.panels[idx].show ? fasCheckCircle : fasCircle;
    },
    // Control status (show) panel / even you can reset all
    handleStatusPanel(i, reset = false) {
      const updatedPanel = this.panels.map((obj, idx) => {
        if (reset) return { ...obj, show: true };

        return i === idx ? { ...obj, show: !obj.show } : obj;
      });
      this.$root.$emit('panels-position', updatedPanel);
    },
    // display toggle title when hovering
    handleToggleTitle(idx) {
      const titleName = this.$t(this.panels[idx].panel_label);
      const titleUpper = `${titleName[0].toUpperCase()}${titleName.slice(1)}`;

      return this.panels[idx].show
        ? `${this.$t('hide')} ${titleUpper} Panel`
        : `${this.$t('show')} ${titleUpper} Panel`;
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  @media (min-width: 600px) {
    margin-right: 8px;
  }
}

button:last-of-type {
  margin-right: 0;
}

.q-item {
  min-height: 0;
}
</style>
