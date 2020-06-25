<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree
      class="view-tree"
      label-key="labelKey"
      node-key="label"
      :expanded.sync="expanded"
      :nodes="tree"
    >
    </q-tree>
  </div>
</template>

<script>
import matIcons from 'quasar/icon-set/material-icons';

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
    this.$q.iconSet.set(matIcons);
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
