<template>
  <q-page>
    <q-splitter v-model="splitterone" :limits="[0, 100]">

      <template v-show="panels.treeview" v-slot:before>
        <Toolbar heading="Treeview" />
        <q-separator />

        <Treeview v-if="tree.length && manifests.length"
          :manifests="manifests"
          :tree="tree"
          >
        </Treeview>
      </template>

      <template v-slot:after>
        <q-splitter v-model="splittertwo" :limits="[0, 100]">

          <template v-show="panels.text" v-slot:before>
            <Toolbar heading="Text" />
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

              <template v-show="panels.image && imageurl" v-slot:before>
                <Toolbar heading="Image" />
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

              <template v-show="panels.metadata" v-slot:after>
                <Toolbar heading="Metadata" />
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
import Toolbar from '@/components/quasar-toolbar.vue';
import Treeview from '@/components/quasar-tree.vue';

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
    status: Object,
    tree: Array,
  },
  data() {
    return {
      // status: image, text, metadata, treeview
      matrix: [
        { state: [1, 1, 1, 1], ratio: [25, 33, 50] },
        { state: [0, 0, 0, 0], ratio: [0, 0, 0] },
        { state: [1, 1, 1, 0], ratio: [0, 33, 50] },
        { state: [1, 1, 0, 1], ratio: [33, 50, 100] },
        { state: [1, 0, 1, 1], ratio: [33, 0, 50] },
        { state: [1, 0, 1, 0], ratio: [0, 0, 50] },
        { state: [1, 0, 0, 1], ratio: [50, 0, 100] },
        { state: [1, 1, 0, 0], ratio: [0, 50, 100] },
        { state: [1, 0, 0, 0], ratio: [0, 0, 100] },
        { state: [0, 1, 1, 1], ratio: [33, 50, 0] },
        { state: [0, 1, 1, 0], ratio: [0, 50, 0] },
        { state: [0, 1, 0, 1], ratio: [50, 100, 0] },
        { state: [0, 1, 0, 0], ratio: [0, 100, 0] },
        { state: [0, 0, 1, 1], ratio: [50, 0, 0] },
        { state: [0, 0, 1, 0], ratio: [0, 0, 0.1] },
        { state: [0, 0, 0, 1], ratio: [100, 0, 0] },
      ],
      panels: {},
      splitterone: 25,
      splittertwo: 33,
      splitterthree: 50,
    };
  },
  methods: {
    getActivePanels(status) {
      const activePanels = [];

      Object.values(status).forEach((state) => {
        activePanels.push(state ? 1 : 0);
      });

      return activePanels;
    },
    setSplitterRatio(status) {
      const panels = this.getActivePanels(status);

      this.matrix.forEach((obj) => {
        if (JSON.stringify(obj.state) === JSON.stringify(panels)) {
          [this.splitterone, this.splittertwo, this.splitterthree] = obj.ratio;
        }
      });
    },
  },
  created() {
    Object.entries(this.status).forEach(([panel, state]) => {
      this.panels[panel] = state;
    });
    this.setSplitterRatio(this.panels);
  },
  mounted() {
    this.$root.$on('update-panel-status', (status) => {
      this.panels = status;
      this.setSplitterRatio(status);
    });
  },
};
</script>

<style lang="scss" scoped>
  @import '../css/quasar.responsive.scss';

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
