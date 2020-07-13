<template>
  <div>
    <q-btn
      flat
      dense
      size="md"
      class="q-mb-md"
      v-for="(name, idx) in panels"
      :aria-selected="toggleAria(idx)"
      :key="idx"
      :title="toggleTitle(idx)"
      @click="updateStatus(idx)"
      >
      <q-icon class="q-pr-xs" size="xs" :name="toggleIcon(idx)" />
      {{ name }}
    </q-btn>

    <q-btn
      flat
      dense
      size="md"
      class="q-mb-md"
      no-caps
      title="Reset Tabs"
      @click="resetPanelStatus"
      >
      <q-icon class="q-pr-xs" size="xs" :name="fasUndo" />
      {{ 'Reset Tabs' | capitalize }}
    </q-btn>
  </div>
</template>

<script>
import {
  fasUndo,
  fasCircle,
  fasCheckCircle,
} from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Togglebar',
  props: {
    status: Object,
  },
  data() {
    return {
      panels: [],
    };
  },
  filters: {
    capitalize(s) {
      return s.toUpperCase();
    },
  },
  methods: {
    resetPanelStatus() {
      for (let index = 0; index < this.panels.length; index += 1) {
        this.status[this.panels[index]] = true;
      }
      this.$root.$emit('update-panel-status', this.status);
    },
    toggleAria(id) {
      return !!this.status[this.panels[id]];
    },
    toggleIcon(id) {
      return this.status[this.panels[id]] ? fasCheckCircle : fasCircle;
    },
    toggleTitle(id) {
      const caption = this.ucfirst(this.panels[id]);
      return this.status[this.panels[id]] ? `Hide ${caption} Tab` : `Show ${caption} Tab`;
    },
    ucfirst(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    updateStatus(id) {
      this.status[this.panels[id]] = !this.status[this.panels[id]];
      this.$root.$emit('update-panel-status', this.status);
    },
  },
  created() {
    this.fasUndo = fasUndo;
    this.fasCircle = fasCircle;
    this.fasCheckCircle = fasCheckCircle;

    // just show the toggle buttons needed according to the config
    Object.entries(this.status).forEach(([panel, state]) => {
      if (state === true) {
        this.panels.push(panel);
      }
    });
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
