<template>
  <div class="q-gutter-sm sub-viewer-1-nav__items" title="Tab options">
    <q-btn
      v-for="(name, idx) in panels"
      :key="idx"
      outline
      :aria-selected="toggleAria(idx)"
      :title="toggleTitle(idx)"
      @click="updateStatus(idx)"
      >
      <q-icon
        :name="toggleIcon(idx)"
        size="24px"
        class="q-pr-sm" />
      {{ name }}
    </q-btn>
    <q-btn
      @click="resetPanelStatus"
      no-caps
      flat
      color="black">
      <q-icon
        :name="fasUndo"
        size="16px"
        class="q-pr-xs" />
      Reset Tabs
    </q-btn>
  </div>
</template>

<script>
import { fasUndo, fasCircle, fasCheckCircle } from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Togglebar',
  props: {
    status: Object,
  },
  created() {
    this.fasUndo = fasUndo;
    this.fasCircle = fasCircle;
    this.fasCheckCircle = fasCheckCircle;
  },
  data() {
    return {
      panels: ['treeview', 'text', 'image', 'metadata'],
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
      return this.status[this.panels[id]]
        ? fasCheckCircle
        : fasCircle;
    },
    togglePath(id) {
      return this.status[this.panels[id]]
        ? this.svg['check-circle']
        : this.svg.circle;
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
};
</script>
