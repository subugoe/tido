<template>
  <div class="q-d-flex">
    <ToggleFilter>
      <q-list class="toggle-list">
        <q-item v-for="(p, i) in panels" :key="`toggle${i}`"
          class="bg-grey-2"
          clickable
          v-close-popup
          :title="handleToggleTitle(i)"
          @click="() => handleStatusPanel(i)"
          >
          <q-icon class="q-pr-xs" size="xs" :name="renderCheckIcon(i)" />
          {{ p.toolbar.toUpperCase() }}
        </q-item>

        <q-item
          class="bg-grey-5"
          clickable
          title="Reset panels to default view"
          v-close-popup
          @click="()=> handleStatusPanel(-1, true)"
          >
           <q-icon class="q-pr-xs text-capitalize" size="xs" :name="fasUndo" />
          {{ 'Reset' }}
        </q-item>
      </q-list>
    </ToggleFilter>

    <PanelsPosition :panelboxes="panels"/>
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
    // Show icon of checkbox depend on current status
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
    // Display Toggle Title when hover over
    handleToggleTitle(idx) {
      return this.panels[idx].show ? `Hide ${this.panels[idx].name} Tab` : `Show ${this.panels[idx].name} Tab`;
    },
  },
  created() {
    // Mount the fonts
    this.fasUndo = fasUndo;
    this.fasCircle = fasCircle;
    this.fasCheckCircle = fasCheckCircle;
  },
};
</script>

<style lang="sass" scoped>
  button
    @media (min-width: 600px)
      margin-right: 8px
  button:last-of-type
    margin-right: 0
  .toggle-list
    > *
      align-items: center
</style>
