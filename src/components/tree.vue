<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree
      class="view-tree"
      label-key="label-key"
      node-key="label"
      :expanded.sync="expanded"
      :nodes="tree"
      :selected-color="$q.dark.isActive ? 'grey' : ''"
      :selected.sync="selected"
      >
      <template v-slot:default-body={node}>
        <div v-if="!node.children" :id="`selectedItem-${node['label']}`"></div>
      </template>
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
      expanded: [],
      selected: this.manifests[0].sequence[0].id,
      sequenceindex: 0,
    };
  },
  created() {
    this.$q.iconSet.set(matIcons);
  },
  mounted() {
    // expand the root node as well as the first knot which contains the actual item selected
    this.expanded.push(this.tree[0].label, this.manifests[0].label);

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
};
</script>

<style lang="scss" scoped>
@import './src/css/helper';

.view-tree {
  @include make-responsive-height();
  -ms-overflow-style: none;
  overflow-y: scroll;
  scrollbar-width: none;
}

.q-tree__node-collapsible .q-tree__children {
  > .q-tree__node--parent {
    > .q-tree__node-header {
      background-color: $light;
      left: 0;
      position: sticky;
      top: 0;
      z-index: 999;
      @media (prefers-color-scheme: dark) {
        background-color: $grey-9;
      }
    }
  }
}

.q-tree__node-header-content.col.row.no-wrap.items-center {
  z-index: 99;
}

.q-tree__children {
  cursor: pointer;
}

.view-tree::-webkit-scrollbar {
  display: none;
}
</style>
