<template>
  <q-page>
    <div class="row panels-target">
      <div v-for="(p, i) in panels" :key="i" v-show="panels[i][1].show"
        class="col-12 col-sm-6 col-md-3"
        >
        <Toolbar :heading="p[1].heading" />
        <q-separator />

        <component v-if="ready" :is="components[p[0]]" :key="keys[p[0]]" v-bind="$props" />
      </div>
    </div>
  </q-page>
</template>

<script>
import Annotations from '@/components/annotations.vue';
import Content from '@/components/content.vue';
import Metadata from '@/components/metadata.vue';
import OpenSeadragon from '@/components/openseadragon.vue';
import Tabs from '@/components/tabs.vue';
import Toolbar from '@/components/toolbar.vue';
import Treeview from '@/components/tree.vue';

export default {
  name: 'MainView',
  components: {
    Annotations,
    Content,
    Metadata,
    OpenSeadragon,
    Tabs,
    Toolbar,
    Treeview,
  },
  props: {
    annotations: Object,
    collection: Object,
    config: Object,
    contenturl: String,
    fontsize: Number,
    imageurl: String,
    itemlabel: String,
    language: String,
    labels: Object,
    manifests: Array,
    request: Function,
    tree: Array,
  },
  data() {
    return {
      components: {
        annotations: 'Annotations',
        image: 'OpenSeadragon',
        meta: 'Metadata',
        tabs: 'Tabs',
        text: 'Content',
        tree: 'Treeview',
      },
      panels: [],
    };
  },
  computed: {
    keys() {
      return {
        image: this.imageurl,
        text: this.contenturl,
      };
    },
    ready() {
      return Object.keys(this.collection).length && this.manifests.length && this.tree.length;
    },
  },
  created() {
    this.panels = Object.entries(this.config.panels).sort((a, b) => a[1].order - b[1].order);
  },
};
</script>

<style lang="sass" scoped>
  .panels-target
    > *
      border-right: 1px solid #ddd
      flex: auto
</style>
