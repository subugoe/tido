<template>
  <q-page>
    <MainViewPanels :panels="panels" :componentProps="panelsProps" />
  </q-page>
</template>

<script>
import Content from '@/components/content.vue';
import MainViewPanels from '@/components/util/mainViewPanels.vue';
import Metadata from '@/components/tab-panels/Metadata.vue';
import OpenSeadragon from '@/components/openseadragon.vue';
import Treeview from '@/components/tab-panels/TreeView.vue';

export default {
  name: 'MainView',
  components: {
    MainViewPanels,
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
      panels: [
        {
          component: Content,
          name: 'text',
          show: true,
          tabs: [],
          toolbar: 'Content',
        },
        {
          component: null,
          name: 'tabs',
          show: true,
          tabs: {
            children: [
              {
                component: Treeview,
                label: 'Contents',
                name: 'content',
              },
              {
                component: Metadata,
                label: 'Metadata',
                name: 'meta',
              },
            ],
            model: 'content',
          },
          toolbar: 'Content & Metadata',
        },
        {
          component: OpenSeadragon,
          name: 'image',
          show: true,
          tabs: [],
          toolbar: 'Image',
        },
        {
          component: null,
          name: 'annotations',
          show: true,
          tabs: [],
          toolbar: 'Annotation',
        },
      ],
    };
  },
  computed: {
    panelsProps() {
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
      });
    });
    // hide image panel, if no imageurl is provided
    this.$root.$on('update-item', () => {
      this.states.image = this.config.panels.image.show && !(this.imageurl === '');
    });
  },
};
</script>
