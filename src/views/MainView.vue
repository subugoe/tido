<template>
  <div class="root panels-target q-gutter-md q-px-md q-pb-md" :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-3'">
    <div v-for="(panel, i) in panels" v-show="panel.show" :key="`pc${i}`" class="item">
      <Panel :panel="panel" :active-view="getActiveView(i)" @active-view="onActiveViewChange($event, i)" />
    </div>
  </div>
</template>

<script>
import Panel from 'components/panels/Panel.vue';

export default {
  name: 'MainView',
  components: {
    Panel,
  },
  computed: {
    panels() {
      const { panels } = this.config;
      return panels;
    },
    config() {
      return this.$store.getters['config/config'];
    },
    activeViews() {
      return this.$store.getters['config/activeViews'];
    }
  },
  mounted() {
  },
  methods: {
    onActiveViewChange(viewIndex, panelIndex) {
      this.$store.dispatch('config/setActivePanelView', {viewIndex, panelIndex});
    },
    getActiveView(panelIndex) {
      return this.activeViews[panelIndex];
    }
  }
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
