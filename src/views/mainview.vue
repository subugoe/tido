<template>
  <q-page>
    <div class="row panels-target">
<!-- 1st panel; defaults to Tree | Meta -->
      <div class="col-12 col-sm-6 col-md-3" v-show="config.panels.tabs.show && states.tabs">
        <Toolbar :heading="config.panels.tabs.name" />

        <q-card flat>
          <q-tabs v-model="tab" active-bg-color="grey-4" align="right">
            <q-tab name="contents" label="Contents" />
            <q-tab name="meta" label="Metadata" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated class="content-panel" keep-alive>
            <q-tab-panel name="contents">
              <Treeview v-if="tree.length && manifests.length"
                :manifests="manifests"
                :tree="tree"
              />
            </q-tab-panel>

            <q-tab-panel name="meta">
              <div class="scroll-panel">
                <Metadata v-if="manifests.length"
                  :collection="collection"
                  :config="config"
                  :itemlabel="itemlabel"
                  :language="language"
                  :manifests="manifests"
                />
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>

<!-- 2nd panel; defaults to Image -->
      <div class="col-12 col-sm-6 col-md-3"
        v-show="config.panels.image.show && states.image && imageurl"
        >
        <Toolbar :heading="config.panels.image.name" />

        <div class="q-pa-md q-gutter-sm overflow-hidden">
          <div class="scroll-panel">
            <OpenSeadragon :key="imageurl" :imageurl="imageurl" />
          </div>
        </div>
      </div>

<!-- 3rd panel; defaults to Text -->
      <div class="col-12 col-sm-6 col-md-3" v-show="config.panels.text.show && states.text">
        <Toolbar :heading="config.panels.text.name" />

        <div class="q-pa-md q-gutter-sm">
          <div class="scroll-panel">
            <q-infinite-scroll>
              <Content
                :key="contenturl"
                :contenturl="contenturl"
                :fontsize="fontsize"
                :manifests="manifests"
                :request="request"
              />
            </q-infinite-scroll>
          </div>
        </div>
      </div>

<!-- 4th panel; defaults to Annotations -->
      <div
        class="col-12 col-sm-6 col-md-3"
        v-show="config.panels.annotations.show && states.annotations"
        >
        <Toolbar :heading="config.panels.annotations.name" />

      </div>
    </div>
  </q-page>
</template>

<script>
import Content from '@/components/content.vue';
import Metadata from '@/components/metadata.vue';
import OpenSeadragon from '@/components/openseadragon.vue';
import Toolbar from '@/components/toolbar.vue';
import Treeview from '@/components/tree.vue';

export default {
  name: 'MainView',
  components: {
    Content,
    Metadata,
    OpenSeadragon,
    Toolbar,
    Treeview,
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
    request: Function,
    tree: Array,
  },
  data() {
    return {
      states: {},
      tab: '',
    };
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
    // emitted by @/components/togglebar.vue
    this.$root.$on('update-panel-status', (status) => {
      this.states = status;
    });
    // hide image panel, if no imageurl is provided
    this.$root.$on('update-item', () => {
      this.states.image = this.config.panels.image.show && !(this.imageurl === '');
    });
  },
};
</script>

<style lang="sass" scoped>
  @import '../css/responsive-heights.sass'

  .panels-target
    > *
      border-right: 1px solid #ddd
      flex: auto

  .scroll-panel
    -ms-overflow-style: none
    overflow: auto
    scrollbar-width: none
    @include makeResponsiveHeight()

  .scroll-panel::-webkit-scrollbar
    display: none
</style>
