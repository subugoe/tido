<template>
  <div class="root panels-target">
    <div
      v-for="(panel, i) in panels"
      v-show="panel.show"
      :key="`pc${i}`"
      class="item"
    >
      <Panel :panel="panel" @active-view="onActiveViewChange($event, i)" />
    </div>
  </div>
</template>

<script>
import Panel from '@/components/Panel.vue';

export default {
  name: 'MainView',
  components: {
    Panel,
  },
  computed: {
    panels() {
      const { panels } = this.config;
      return [panels[0]];
    },
    config() {
      return this.$store.getters['config/config'];
    },
  },
  mounted() {
    console.log('main view mounted');
  },
  methods: {
    onActiveViewChange(viewIndex, panelIndex) {
      this.$store.dispatch('config/setActivePanelView', {viewIndex, panelIndex});
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
