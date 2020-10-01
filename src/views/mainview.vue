<template>
  <section>
    <div class="row panels-target">
      <div v-for="(p, i) in panels" :key="`pc${i}`" v-show="p.show"
        class="col-12 col-sm-6 col-md-3"
        >
        <Toolbar :heading="p.panel_label" />

        <q-separator />

        <div v-if="p.connector.length != 0">
          <!-- shows the nested tab components -->
          <q-card v-if="p.connector.length > 1" flat>
            <div class="tabs-container">
              <q-tabs v-for="(tab, i) in p.connector" :key="`pt${i}`"
                :active-bg-color="$q.dark.isActive ? 'bg-black' : 'bg-grey-4'"
                class="content-tabs"
                v-model="p.tab_model"
                >
                <q-tab :name="`tab${i}`" :label="tab.label" />
              </q-tabs>
            </div>

            <q-separator />

            <q-tab-panels v-model="p.tab_model" animated class="content-panel" keep-alive>
              <q-tab-panel v-for="(tab, i) in p.connector"
                :key="`co${i}`"
                :name="`tab${i}`"
                >
                <component :is="tab.component" v-bind="componentProps[tab.id]" />
              </q-tab-panel>
            </q-tab-panels>
          </q-card>

          <!-- shows the panels -->
          <div v-else  class="q-pa-md q-gutter-sm overflow-hidden">
            <component v-if="p.connector.length === 1" :is="p.connector[0].component"
              v-bind="componentProps[p.connector[0].id]"
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
  // watch: {
  //   '$q.dark.isActive'(val) {
  //     console.log(val ? 'On dark mode' : 'On light mode');
  //   },
  // },
  components: {
    Toolbar,
  },
  props: {
    collection: Object,
    contenturl: String,
    fontsize: Number,
    imageurl: String,
    itemlabel: String,
    labels: Object,
    language: String,
    manifests: Array,
    panels: Array,
    request: Function,
    tree: Array,
  },
  computed: {
    componentProps() {
      return {
        1: {
          manifests: this.manifests,
          tree: this.tree,
        },
        2: {
          collection: this.collection,
          config: this.config,
          itemlabel: this.itemlabel,
          labels: this.labels,
          language: this.language,
          manifests: this.manifests,
        },
        3: {
          imageurl: this.imageurl,
          key: this.imageurl,
        },
        4: {
          contenturl: this.contenturl,
          fontsize: this.fontsize,
          key: this.contenturl,
          manifests: this.manifests,
          request: this.request,
        },
      };
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
