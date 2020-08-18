<template>
  <Treeview v-if="tree.length && manifests.length"
    :manifests="manifests"
    :tree="tree"
  />
</template>

<script>
import Treeview from '@/components/tree.vue';

export default {
  props: {
    tree: Array,
    manifests: Array,
  },
  components: {
    Treeview,
  },
};
</script>
