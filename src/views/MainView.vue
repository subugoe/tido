<template>
  <div class="panels-target q-gutter-md-md q-px-md q-px-lg-lg q-pb-md-md">
    <div v-for="(panel, i) in panels" v-show="panel.show" :key="`pc${i}`" class="item q-pb-md q-pb-md-none">
      <Panel :panel="panel" :active-view="getActiveView(i)" @active-view="onActiveViewChange($event, i)" />
    </div>
  </div>
</template>

<script>
import Panel from '@/components/panels/Panel.vue';

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
    },
  },
  methods: {
    onActiveViewChange(viewIndex, panelIndex) {
      this.$store.dispatch('config/setActivePanelView', { viewIndex, panelIndex });
    },
    getActiveView(panelIndex) {
      return this.activeViews[panelIndex];
    },
  },
};
</script>

<style lang="scss" scoped>
.content-tabs {
  display: inline-block;
}

.panels-target {
  display: flex;
  @media (max-width: $breakpoint-sm-max) {
    flex-direction: column;
  }
}

.item {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  @media (max-width: $breakpoint-sm-max) {
    max-height: 66vh;
  }
}

.tabs-container {
  display: flex;

  > * {
    flex: 1;
  }
}
</style>
