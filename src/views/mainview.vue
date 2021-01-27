<template>
  <section>
    <div
      v-if="ready"
      class="row panels-target"
    >
      <div
        v-for="(p, index) in panels"
        v-show="p.show && p.connector.length"
        :key="`pc${index}`"
        class="col-12 col-sm-6 col-md-3"
      >
        <Toolbar
          v-if="config.headers.panelheadings"
          :heading="p.panel_label"
        />

        <q-separator />

        <div>
          <!-- shows the nested tabs -->
          <q-card
            v-if="p.connector.length > 1"
            flat
          >
            <div class="tabs-container">
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
              class="content-panel"
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
            class="q-pa-sm overflow-hidden"
          >
            <component
              :is="p.connector[0].component"
              :key="keys[p.connector[0].id]"
              v-bind="$props"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
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
    contenturl: {
      type: String,
      default: () => '',
    },
    fontsize: {
      type: Number,
      default: () => 14,
    },
    imageurl: {
      type: String,
      default: () => '',
    },
    itemlabel: {
      type: String,
      default: () => '',
    },
    labels: {
      type: Object,
      default: () => {},
    },
    language: {
      type: String,
      default: () => '',
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
      return this.manifests.length && this.tree.length;
    },
    keys() {
      return { 3: this.imageurl, 4: this.contenturl };
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
</style>
