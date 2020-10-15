<template>
  <div class="q-pa-md">
    <q-tree
      class="view-tree"
      label-key="label-key"
      node-key="label"
      :expanded.sync="expanded"
      :icon="fasCaretRight"
      :nodes="tree"
      :selected-color="$q.dark.isActive ? 'grey' : ''"
      :selected.sync="selected"
      >
      <template v-slot:default-body="{node}">
        <div v-if="!node.children" :id="`selectedItem-${node['label']}`"></div>
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
    manifests: Array,
    tree: Array,
  },
  data() {
    return {
      expanded: [],
      selected: null,
      sequenceindex: 0,
    };
  },
  created() {
    this.fasCaretRight = fasCaretRight;
  },
  mounted() {
    // select tree node
    this.selected = treestore.state.selectedItemTree || this.manifests[0].sequence[0].id;

    // expand the first level
    this.expanded.push(this.tree[0].label);
    // expand second label - dynamic
    const finalSeqIdx = treestore.state.seqTree || 0;

    this.expanded.push(this.manifests[finalSeqIdx].label);

    this.$root.$on('update-item', (item, seqIdx) => {
      this.selected = item;
      treestore.updateselectedtreeitem(item);
      treestore.updatetreesequence(seqIdx);
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
};
</script>
