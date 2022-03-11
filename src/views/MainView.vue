<template>
  <div
    v-if="ready"
    class="root panels-target"
  >
    <div
      v-for="(p, index) in panels"
      v-show="p.show && p.connector.length"
      :key="`pc${index}`"
      class="item"
    >
      <ToolBar
        v-if="config['header_section'].panelheadings"
        :heading="p.panel_label"
      />

      <q-separator />

      <!-- shows the nested tabs -->
      <div
        v-if="p.connector.length > 1"
        class="item-content"
      >
        <div class="tabs-container">
          <q-tabs
            v-for="(tab, i) in p.connector"
            :key="`pt${i}`"
            v-model="p.tab_model"
            class="content-tabs"
            :active-bg-color="$q.dark.isActive ? 'bg-black' : 'bg-grey-4'"
            dense
          >
            <q-tab
              :name="`tab${i}`"
              :label="$t(tab.label)"
            />
          </q-tabs>
        </div>

        <q-tab-panels
          v-model="p.tab_model"
          animated
          keep-alive
        >
          <q-tab-panel
            v-for="(tab, idx) in p.connector"
            :key="`co${idx}`"
            :name="`tab${idx}`"
            class="q-pa-none"
          >
            <component
              :is="tab.component"
              :key="keys[tab.id]"
              :panels="panels"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>

      <!-- shows the panels -->
      <div
        v-else-if="p.connector.length === 1"
        class="item-content"
      >
        <component
          :is="p.connector[0].component"
          :key="keys[p.connector[0].id]"
          :panels="panels"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ToolBar from '@/components/ToolBar.vue';

export default {
  name: 'MainView',
  components: {
    ToolBar,
  },
  props: {
    panels: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
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
    keys() {
      return { 3: this.imageUrl, 4: this.contentUrls[0] };
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
