<template>
  <div
    v-if="ready"
    class="root panels-target"
  >
    <div
      v-for="(panel, index) in panels"
      v-show="panel.show && panel.connector.length"
      :key="`pc${index}`"
      class="item"
    >
      <ToolBar
        v-if="config['header_section'].panelheadings"
        :heading="panel.panel_label"
      />

      <q-separator />

      <Panel :panel="panel" />
    </div>
  </div>
</template>

<script>
import ToolBar from '@/components/ToolBar.vue';
import Panel from '@/components/Panel.vue';
import * as PanelUtils from '@/utils/panels';

export default {
  name: 'MainView',
  components: {
    ToolBar,
    Panel,
  },
  computed: {
    panels() {
      return this.$store.getters['contents/panels'];
    },
    ready() {
      return (
        this.manifests.length && this.tree.length && this.contentUrls.length
      );
    },
    manifests() {
      return this.$store.getters['contents/manifests'];
    },
    config() {
      return this.$store.getters['config/config'];
    },
    contentUrls() {
      return this.$store.getters['contents/contentUrls'];
    },
    tree() {
      return this.$store.getters['contents/tree'];
    },
    imageUrl() {
      return this.$store.getters['contents/imageUrl'];
    },
  },
  methods: {
    handlePanelChange(value, index) {
      let panels = PanelUtils.getNewPanels(this.panels);

      panels = panels.map((el, i) => ({
        ...el,
        tab_model: i === index ? value : el.tab_model,
      }));

      this.$store.dispatch('contents/setPanels', panels);
    },
  },
};
</script>

<style lang="scss" scoped>
.content-tabs {
  display: inline-block;
}

.item {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  @media (max-width: $breakpoint-sm-custom-md) {
    min-height: 100vh;
  }
}

.item-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

.root {
  display: flex;
  flex: 1;
  flex-direction: row;
  overflow: hidden;
  @media (max-width: $breakpoint-sm-custom-md) {
    flex-direction: column;
    height: auto;
    overflow: scroll;
  }
}

.tabs-container {
  display: flex;

  > * {
    flex: 1;
  }
}
</style>
