<template>
  <div
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

      <Panel :panel="panel" :index="index" />
    </div>
  </div>
</template>

<script>
import ToolBar from '@/components/ToolBar.vue';
import Panel from '@/components/Panel.vue';

export default {
  name: 'MainView',
  components: {
    ToolBar,
    Panel,
  },
  computed: {
    panels() {
      const panels = this.$store.getters['contents/panels'];

      return [panels[1]];
    },
    config() {
      return this.$store.getters['config/config'];
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
