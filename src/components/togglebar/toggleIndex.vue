<template>
  <div class="q-d-flex">
    <ToggleFilter>
      <q-list class="toggle-list">
        <q-item v-for="(p, i) in panels" :key="`toggle${i}`"
          :class="$q.dark.isActive ? 'bg-black' : 'bg-grey-2'"
          clickable
          v-close-popup
          :title="handleToggleTitle(i)"
          @click="() => handleStatusPanel(i)"
          >
          <q-icon class="q-pr-xs" size="xs" :name="renderCheckIcon(i)" />
          {{ p.panel_label.toUpperCase() }}
        </q-item>

        <q-item
          :class="$q.dark.isActive ? 'bg-black' : 'bg-grey-5'"
          clickable
          title="Reset panels to default view"
          v-close-popup
          @click="()=> handleStatusPanel(-1, true)"
          >
          <q-icon class="q-pr-xs text-capitalize" size="xs" :name="fasUndo" />
          {{ 'RESET' }}
        </q-item>
      </q-list>
    </ToggleFilter>

    <PanelsPosition :panelboxes="panels" />
  </div>
</template>

<script>
import {
  fasUndo,
  fasCircle,
  fasCheckCircle,
} from '@quasar/extras/fontawesome-v5';

import PanelsPosition from '@/components/togglebar/panelsposition';
import ToggleFilter from '@/components/togglebar/toggleFilter.vue';

export default {
  name: 'ToggleIndex',
  props: {
    panels: Array,
  },
  components: {
    PanelsPosition,
    ToggleFilter,
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
      const titleName = this.panels[idx].panel_label;
      const titleUpper = `${titleName[0].toUpperCase()}${titleName.slice(1)}`;

      return this.panels[idx].show
        ? `Hide ${titleUpper} Panel`
        : `Show ${titleUpper} Panel`;
    },
  },
  created() {
    // mount the fonts
    this.fasCheckCircle = fasCheckCircle;
    this.fasCircle = fasCircle;
    this.fasUndo = fasUndo;
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
</style>
