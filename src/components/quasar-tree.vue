<template>
  <div class="q-pa-md q-gutter-sm">
    <!-- <q-input
      filled
      label="Filter by label ..."
      ref="filter"
      v-model="filter"
      >
      <template v-slot:append>
        <q-icon v-if="filter !== ''"
          class="cursor-pointer"
          @click="resetSearch"
          :name="fasTimes"
        />
      </template>
    </q-input>
 -->
    <q-tree
      class="view-tree"
      label-key="label-key"
      node-key="label"
      :expanded.sync="expanded"
      :nodes="tree"
      :selected.sync="selected"
      >
    </q-tree>
<!-- ^^ these ones go up here
    :filter="filter"
    :filter-method="search"
 -->
  </div>
</template>

<script>
import matIcons from 'quasar/icon-set/material-icons';
// import { fasTimes } from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Treeview',
  props: {
    manifests: Array,
    tree: Array,
  },
  data() {
    return {
      expanded: [],
      // filter: '',
      selected: this.manifests[0].sequence[0].id,
      sequenceindex: 0,
    };
  },
  // methods: {
  //   resetSearch() {
  //     this.filter = '';
  //     this.$refs.filter.focus();
  //   },
  //   search(node, filter) {
  //     const f = filter.toLowerCase();
  //     return node.label && node.label.toLowerCase().indexOf(f) > -1;
  //   },
  // },
  created() {
    this.$q.iconSet.set(matIcons);
    // this.fasTimes = fasTimes;
  },
  mounted() {
    this.$root.$on('update-item', (item) => {
      this.selected = item;
    });

    // expand the root node as well as the first knot which contains the actual item selected
    this.expanded.push(this.tree[0].label, this.manifests[0].label);

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
