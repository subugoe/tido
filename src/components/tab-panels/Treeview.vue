<template>
  <Tree v-if="tree.length && manifests.length"
    :manifests="manifests"
    :tree="tree"
  />
</template>

<script>
import Tree from '@/components/tree.vue';

export default {
  props: {
    tree: Array,
    manifests: Array,
  },
  components: {
    Tree,
  },
};
</script>
