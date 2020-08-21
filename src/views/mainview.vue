<template>
  <q-page>
    <section>
      <div class="row panels-target">
        <div v-for="(p,i) in panels" :key="`pc${i}`" v-show="p.show"
          class="col-12 col-sm-6 col-md-3"
          >
          <Toolbar :heading="p.toolbar" />

          <!-- Shows the nested tab components  -->
          <q-card v-if="p.tabs.children" flat>
            <div class="tabs-container">
              <q-tabs
                class="content-tabs"
                v-model="p.tabs.model"
                v-for="(tab,i) in p.tabs.children"
                :key="`pt${i}`"
                active-bg-color="grey-4"
                align="right"
                >
                <q-tab :name="tab.name" :label="tab.label" />
              </q-tabs>
            </div>
            <q-separator />

            <q-tab-panels v-model="p.tabs.model" class="content-panel" keep-alive animated>
              <q-tab-panel :name="tab.name" v-for="(tab,i) in p.tabs.children" :key="`ppt${i}`">
                <component :is="tab.component" v-bind="componentProps.tabs[tab.name]" />
              </q-tab-panel>
            </q-tab-panels>
          </q-card>

          <!-- Shows the Direct components  -->
          <div v-else class="q-pa-md q-gutter-sm overflow-hidden">
            <component :is="p.component" v-bind="componentProps.direct[p.name]" />
          </div>
        </div>
      </div>
    </section>
  </q-page>
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
  data() {
    return {
      tab: '',
    };
  },
  computed: {
    componentProps() {
      return {
        direct: {
          image: {
            imageurl: this.imageurl,
            key: this.imageurl,
          },
          text: {
            contenturl: this.contenturl,
            fontsize: this.fontsize,
            key: this.contenturl,
            manifests: this.manifests,
            request: this.request,
          },
        },
        tabs: {
          meta: {
            collection: this.collection,
            config: this.config,
            itemlabel: this.itemlabel,
            language: this.language,
            manifests: this.manifests,
          },
          content: {
            manifests: this.manifests,
            tree: this.tree,
          },
          contentt: {
            manifests: this.manifests,
            tree: this.tree,
          },
        },
      };
    },
  },
  methods: {
    updateTab() {
      this.$root.$emit('update-tab', this.tab);
    },
  },
};
</script>

<style lang="sass" scoped>
  .panels-target
    > *
      border-right: 1px solid #ddd
      flex: auto

  .content-tabs
    display: inline-block

  .tabs-container
    display: flex
    > *
      flex: 1
</style>
