<template>
  <ul class="sub-viewer-1-nav__items" title="Tab options">
    <li v-for="(name, idx) in panels" :key="idx">
      <button
        class="sub-viewer-1-nav-item"
        :aria-selected="toggleAria(idx)"
        :title="toggleTitle(idx)"
        @click="updateStatus(idx);"
        >
        <img style="height: 24px; width: 24px;" :src="toggleIcon(idx)" />
        <span aria-hidden="true">{{ name }}</span>
      </button>
    </li>

    <li>
      <button class="sub-viewer-1-reset" title="Reset Tabs" @click="resetPanelStatus();">
        <img style="height: 24px; width: 24px;" src="statics/icons/undo--normal.svg" />
        <span aria-hidden="true">{{ 'Reset Tabs' | capitalize }}</span>
      </button>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Togglebar',
  props: {
    status: Object,
    vectors: Object,
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
        ? 'statics/icons/check-circle--normal.svg'
        : 'statics/icons/circle--normal.svg';
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
