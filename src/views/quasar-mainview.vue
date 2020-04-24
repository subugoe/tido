<template>
  <q-page>
    <q-splitter v-model="splitterone" :limits="[0, 100]">
      <template v-show="panels.treeview" v-slot:before>
        <Toolbar heading="Treeview" />
        <q-separator />

        <Treeview
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

            <Content
              :key="itemurl"
              :itemurl="itemurl"
              :manifests="manifests"
              :request="request"
              >
            </Content>
          </template>

          <template v-slot:after>
            <q-splitter v-model="splitterthree" :limits="[0, 100]">
              <template v-show="panels.image && imageurl" v-slot:before>
                <Toolbar heading="Image" />
                <q-separator />

                <OpenSeadragon
                  :key="imageurl"
                  :imageurl="imageurl"
                  >
                </OpenSeadragon>
              </template>

              <template v-show="panels.metadata" v-slot:after>
                <Toolbar heading="Metadata" />
                <q-separator />

                <Metadata v-if="manifests.length"
                  :collection="collection"
                  :itemurl="itemurl"
                  :manifests="manifests"
                  >
                </Metadata>
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
    imageurl: String,
    itemurl: String,
    manifests: Array,
    request: Function,
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
      panels: {
        treeview: true, text: true, image: true, metadata: true,
      },
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
  mounted() {
    this.$root.$on('update-panel-status', (status) => {
      this.panels = status;
      this.setSplitterRatio(status);
    });
  },
};
</script>
