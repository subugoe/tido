<template>
  <section>
    <div class="row panels-target">
      <div v-for="(p, i) in panels" :key="`pc${i}`" v-show="p.show"
        class="col-12 col-sm-6 col-md-3"
        >
        <Toolbar :heading="p.toolbar" />

        <q-separator />

        <!-- shows the nested tab components -->
        <q-card v-if="p.tabs.children" flat>
          <div class="tabs-container">
            <q-tabs v-model="p.tabs.model" v-for="(tab, i) in p.tabs.children" :key="`pt${i}`"
              active-bg-color="grey-4"
              class="content-tabs"
              >
              <q-tab :name="tab.name" :label="tab.label" />
            </q-tabs>
          </div>

          <q-separator />

          <q-tab-panels v-model="p.tabs.model" animated class="content-panel" keep-alive>
            <q-tab-panel :name="tab.name" v-for="(tab, i) in p.tabs.children" :key="i">
              <component :is="tab.component" v-bind="$props" :key="keys[tab.name]" />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>

        <!-- shows the panels -->
        <div v-else class="q-pa-md q-gutter-sm overflow-hidden">
          <component :is="p.component" v-bind="$props" :key="keys[p.name]" />
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
    collection: Object,
    config: Object,
    contenturl: String,
    fontsize: Number,
    imageurl: String,
    itemlabel: String,
    language: String,
    manifests: Array,
    panels: Array,
    request: Function,
    tree: Array,
  },
  computed: {
    keys() {
      return {
        image: this.imageurl,
        text: this.contenturl,
      };
    },
  },
};
</script>

<style lang="sass" scoped>
  .content-tabs
    display: inline-block

  .panels-target
    > *
      border-right: 1px solid #ddd
      flex: auto

  .tabs-container
    display: flex
    > *
      flex: 1
</style>
