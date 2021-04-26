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
      <Toolbar
        v-if="config.headers.panelheadings"
        :heading="p.panel_label"
      />

      <q-separator />

      <!-- shows the nested tabs -->
      <q-card
        v-if="p.connector.length > 1"
        flat
      >
        <div class="tabs-container item-content">
          <q-tabs
            v-for="(tab, i) in p.connector"
            :key="`pt${i}`"
            v-model="p.tab_model"
            class="content-tabs"
            :active-bg-color="$q.dark.isActive ? 'bg-black' : 'bg-grey-4'"
          >
            <q-tab
              :name="`tab${i}`"
              :label="tab.label"
            />
          </q-tabs>
        </div>

        <q-separator />

        <q-tab-panels
          v-model="p.tab_model"
          animated
          keep-alive
        >
          <q-tab-panel
            v-for="(tab, idx) in p.connector"
            :key="`co${idx}`"
            :name="`tab${idx}`"
          >
            <component
              :is="tab.component"
              :key="keys[tab.id]"
              v-bind="$props"
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>

      <!-- shows the panels -->
      <div
        v-else-if="p.connector.length === 1"
        class="item-content"
      >
        <component
          :is="p.connector[0].component"
          :key="keys[p.connector[0].id]"
          v-bind="$props"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from '@/components/toolbar.vue';

export default {
  name: 'MainView',
  components: {
    Toolbar,
  },
  props: {
    collection: {
      type: Object,
      default: () => {},
    },
    config: {
      type: Object,
      default: () => {},
    },
    contenttypes: {
      type: Array,
      default: () => [],
    },
    contenturls: {
      type: Array,
      default: () => [],
    },
    fontsize: {
      type: Number,
      default: () => 14,
    },
    imageurl: {
      type: String,
      default: () => '',
    },
    item: {
      type: Object,
      default: () => {},
    },
    labels: {
      type: Object,
      default: () => {},
    },
    manifests: {
      type: Array,
      default: () => [],
    },
    panels: {
      type: Array,
      default: () => [],
    },
    request: {
      type: Function,
      default: () => null,
    },
    tree: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ready() {
      return this.manifests.length && this.tree.length && this.contenturls.length;
    },
    keys() {
      return { 3: this.imageurl, 4: this.contenturls[0] };
    },
  },
};
</script>

<style lang="scss" scoped>
.content-tabs {
  display: inline-block;
}

.tabs-container {
  display: flex;

  > * {
    flex: 1;
  }
}

.root {
  display: flex;
  flex: 1;
  flex-direction: row;
  overflow: hidden;
}

.item {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

</style>
