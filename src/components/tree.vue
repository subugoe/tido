<template>
  <div class="item">
    <q-tree
      class="item-content"
      node-key="label"
      :expanded.sync="expanded"
      :icon="fasCaretRight"
      :nodes="tree"
      :selected-color="$q.dark.isActive ? 'grey' : ''"
      :selected.sync="selected"
      :style="`max-height:${height}px`"
    >
      <template
        #default-body="{node}"
      >
        <div
          v-if="!node.children"
          :id="`selectedItem-${node['label']}`"
        />
      </template>

      <template #default-header="prop">
        <div
          :id="prop.node['label']"
          class="row items-center"
        >
          <div> {{ prop.node.labelSheet? $t(labels.item):'' }} {{ prop.node['label-key'] }}</div>
        </div>
      </template>
    </q-tree>
  </div>
</template>

<script>
import { fasCaretRight } from '@quasar/extras/fontawesome-v5';
import treestore from '@/stores/treestore.js';

export default {
  name: 'Treeview',
  props: {
    labels: {
      type: Object,
      default: () => {},
    },
    manifests: {
      type: Array,
      default: () => [],
    },
    tree: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      expanded: [],
      height: 0,
      selected: null,
      sequenceindex: 0,
    };
  },
  created() {
    this.fasCaretRight = fasCaretRight;
  },
  mounted() {
    this.handleTreePanelHeight();

    // select tree node
    this.selected = treestore.state.selectedItemTree || this.manifests[0].sequence[0].id;

    // expand the first level
    this.expanded.push(this.tree[0].label);
    // expand second label - dynamic
    const finalSeqIdx = treestore.state.seqTree || 0;

    this.expanded.push(this.manifests[finalSeqIdx].label);

    this.$root.$on('update-item', (item) => {
      this.selected = item;
    });

    this.$root.$on('update-sequence-index', (index) => {
      if (index !== this.sequenceindex) {
        this.sequenceindex = index;

        if (!this.expanded.includes(this.manifests[index].label)) {
          this.expanded.push(this.manifests[index].label);
        }
      }
    });

    this.$root.$on('update-tree-knots', (label) => {
      if (this.expanded.includes(label)) {
        const index = this.expanded.indexOf(label);

        if (index > -1) {
          this.expanded.splice(index, 1);
        }
      } else {
        this.expanded.push(label);
      }
    });
  },
  methods: {
    handleTreePanelHeight() {
      const el = document.querySelector('.item-content');

      if (el && this.height !== el.clientHeight) {
        this.height = el.clientHeight;
      }
    },
  },
};
</script>

<style scoped>
.item {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.item-content {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  overflow: auto;
}
</style>
