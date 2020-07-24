<template>
  <q-page>
    <q-splitter v-model="splitterone" :limits="[0, 100]">

      <template v-show="config.panels.tree.show && states.tree" v-slot:before>
        <Toolbar :heading="config.panels.tree.name" />
        <q-separator />

        <Treeview v-if="tree.length && manifests.length"
          :manifests="manifests"
          :tree="tree"
          >
        </Treeview>
      </template>

      <template v-slot:after>
        <q-splitter v-model="splittertwo" :limits="[0, 100]">

          <template v-show="config.panels.text.show && states.text" v-slot:before>
            <Toolbar :heading="config.panels.text.name" />
            <q-separator />

            <div class="q-pa-md q-gutter-sm">
              <div class="scrollPanel">

                <q-infinite-scroll>
                  <Content
                    :key="contenturl"
                    :contenturl="contenturl"
                    :fontsize="fontsize"
                    :manifests="manifests"
                    :request="request"
                    >
                  </Content>
                </q-infinite-scroll>
              </div>
            </div>
          </template>

          <template v-slot:after>
            <q-splitter v-model="splitterthree" :limits="[0, 100]">

              <template v-show="config.panels.image.show && states.image && imageurl" v-slot:before>
                <Toolbar :heading="config.panels.image.name" />
                <q-separator />

                <div class="q-pa-md q-gutter-sm" style="overflow:hidden">
                  <div class="scrollPanel">
                    <OpenSeadragon
                      :key="imageurl"
                      :imageurl="imageurl"
                      >
                    </OpenSeadragon>
                  </div>
                </div>
              </template>

              <template v-show="config.panels.metadata.show && states.metadata" v-slot:after>
                <Toolbar :heading="config.panels.metadata.name" />
                <q-separator />

                <div class="scrollPanel">
                  <q-infinite-scroll>
                    <Metadata v-if="manifests.length"
                      :collection="collection"
                      :config="config"
                      :language="language"
                      :manifests="manifests"
                      :itemlabel="itemlabel"
                      >
                    </Metadata>
                  </q-infinite-scroll>
                </div>
              </template>
            </q-splitter>
          </template>
        </q-splitter>
      </template>
    </q-splitter>
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
      // status: tree, text, image, metadata
      matrix: [
        { state: [1, 1, 1, 1], ratio: [25, 33, 50] },
        { state: [0, 0, 0, 0], ratio: [0, 0, 0] },
        { state: [1, 1, 1, 0], ratio: [33, 50, 100] },
        { state: [1, 1, 0, 1], ratio: [33, 50, 0] },
        { state: [1, 0, 1, 1], ratio: [33, 0, 50] },
        { state: [1, 0, 1, 0], ratio: [33, 0, 100] },
        { state: [1, 0, 0, 1], ratio: [50, 0, 0] },
        { state: [1, 1, 0, 0], ratio: [50, 100, 0] },
        { state: [1, 0, 0, 0], ratio: [100, 0, 0] },
        { state: [0, 1, 1, 1], ratio: [0, 33, 50] },
        { state: [0, 1, 1, 0], ratio: [0, 50, 100] },
        { state: [0, 1, 0, 1], ratio: [0, 50, 0] },
        { state: [0, 1, 0, 0], ratio: [0, 100, 0] },
        { state: [0, 0, 1, 1], ratio: [0, 0, 50] },
        { state: [0, 0, 1, 0], ratio: [0, 0, 100] },
        { state: [0, 0, 0, 1], ratio: [0, 0, 0] },
      ],
      splitterone: 25,
      splittertwo: 33,
      splitterthree: 50,
      states: {},
    };
  },
  methods: {
    /**
      * prepare panel's showcases to match against matrix's state
      * caller: *setSplitterRatio()*
      *
      * @param object status
      *
      * @return array activePanels
      */
    getActivePanels(status) {
      const activePanels = [];

      Object.values(status).forEach((state) => {
        activePanels.push(state ? 1 : 0);
      });
      return activePanels;
    },
    /**
      * match activePanels against matrix's state and provide the appropriate splitter ratio
      * caller: limited to this file / view only
      *
      * @param object status
      */
    setSplitterRatio(status) {
      const panelstates = this.getActivePanels(status);

      this.matrix.forEach((mtrx) => {
        if (JSON.stringify(mtrx.state) === JSON.stringify(panelstates)) {
          [this.splitterone, this.splittertwo, this.splitterthree] = mtrx.ratio;
        }
      });
    },
  },
  created() {
    // filter the panel's showcases and leave the config object untouched
    Object.entries(this.config.panels).forEach(([panel, states]) => {
      this.states[panel] = states.show;
    });
    this.setSplitterRatio(this.states);
  },
  mounted() {
    // emitted by @/components/togglebar.vue
    this.$root.$on('update-panel-status', (status) => {
      this.states = status;
      this.setSplitterRatio(status);
    });
    // toggle the image panel depending on imageurl.
    // if no url is provided, the image panel will be hidden
    this.$root.$on('update-item', () => {
      this.states.image = this.config.panels.image.show && !(this.imageurl === '');
      this.setSplitterRatio(this.states);
    });
  },
};
</script>

<style lang="scss" scoped>
  @import '../css/responsive-heights.scss';

  .scrollPanel {
    -ms-overflow-style: none;
    overflow: auto;
    scrollbar-width: none;
    @include makeResponsiveHeight();
  }
  .scrollPanel::-webkit-scrollbar {
    display: none;
  }
</style>
