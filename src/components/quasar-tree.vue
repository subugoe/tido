<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree
      :expanded.sync="expanded"
      :icon="fasCaretRight"
      :nodes="tree"
      node-key="label"
      label-key="labelKey"
      >
    </q-tree>
  </div>
</template>

<script>
import { fasCaretRight } from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Treeview',
  props: {
    manifests: Array,
    tree: Array,
  },
  data() {
    return {
      expanded: ['The Story and Proverbs of Ahikar the Wise'],
    };
  },
  created() {
    this.fasCaretRight = fasCaretRight;
  },
  mounted() {
    this.$root.$on('update-tree-nodes', (index) => {
      this.expanded.push(this.manifests[index].label);
    });
  },
};
</script>
