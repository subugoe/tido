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
            <q-separator />
            <q-tab-panels v-model="p.tabs.model" class="content-panel" animated>
              <q-tab-panel :name="tab.name" v-for="(tab,i) in p.tabs.children" :key="`ppt${i}`">
                <component :is="tab.component" v-bind="componentProps.tabs[tab.name]"></component>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>

          <!-- Shows the Direct components  -->
          <div v-else class="q-pa-md q-gutter-sm overflow-hidden">
            <component :is="p.component" v-bind="componentProps.direct[p.name]"></component>
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
      states: {},
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
  created() {
    // filter the panel's showcases and leave the config object untouched
    Object.entries(this.config.panels).forEach(([panel, states]) => {
      this.states[panel] = states.show;
    });

    this.tab = this.config.panels.tabs.default;
  },
  mounted() {
    // emitted by @/components/toggleIndex.vue
    this.$root.$on('update-panel-status', (status) => {
      this.states = status;
      this.panels.forEach((p, i) => {
        this.panels[i].show = status[p.name];

        if (status[p.name] === undefined) this.panels[i].show = true;
      });
    });
    // hide image panel, if no imageurl is provided
    this.$root.$on('update-item', () => {
      this.states.image = this.config.panels.image.show && !(this.imageurl === '');
    });
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
</style>
