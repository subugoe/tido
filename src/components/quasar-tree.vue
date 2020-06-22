<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree style="cursor: pointer;"
      :expanded.sync="expanded"
      :icon="fasCaretRight"
      label-key="labelKey"
      :nodes="tree"
      node-key="label"
      selected-color="grey"
      text-color="black"
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
      selected: null,
    };
  },
  created() {
    this.fasCaretRight = fasCaretRight;
  },
  mounted() {
    this.$root.$on('update-sequence-index', (index) => {
      this.expanded.push(this.manifests[index].label);
    });
    this.$root.$on('update-item', (item) => {
      this.selected = item;
    });
  },
};
</script>
