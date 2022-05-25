<template>
  <div class="item">
    <q-tree
      v-model:expanded="expanded"
      v-model:selected="selected"
      class="item-content"
      node-key="label"
      :icon="fasCaretRight"
      :nodes="tree"
      :selected-color="$q.dark.isActive ? 'grey' : ''"
    >
      <template #default-body="{ node }">
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
          <div>
            {{ prop.node.labelSheet ? $t(labels.item) : '' }}
            {{ prop.node['label-key'] }}
          </div>
        </div>
      </template>
    </q-tree>
  </div>
</template>

<script>
import { fasCaretRight } from '@quasar/extras/fontawesome-v5';
import Navigation from '@/mixins/navigation';

export default {
  name: 'Treeview',
  mixins: [Navigation],
  data() {
    return {
      expanded: [],
      selected: null,
    };
  },
  computed: {
    expandTreeNodes() {
      return this.$store.getters['contents/expanded'];
    },
    config() {
      return this.$store.getters['config/config'];
    },
    labels() {
      return this.config.labels || {};
    },
    itemUrl() {
      return this.$store.getters['contents/itemUrl'];
    },
    tree() {
      return this.$store.getters['contents/tree'];
    },
    sequenceIndex() {
      return this.$store.getters['contents/selectedSequenceIndex'];
    },
    manifests() {
      return this.$store.getters['contents/manifests'];
    },
  },
  watch: {
    sequenceIndex: {
      handler: 'onSequenceIndexUpdate',
      immediate: true,
    },
    itemUrl: {
      handler(value) {
        this.selected = value;
      },
      immediate: true,
    },
    selected: {
      handler: 'handleSelectedChange',
      immediate: true,
    },
    expandTreeNodes: {
      handler(value) {
        this.expanded = [...value];
      },
      immediate: true,
    },
    tree: {
      handler(value) {
        if (value.length > 0) {
          this.$store.dispatch('contents/addToExpanded', value[0].label);
        }
      },
      immediate: true,
    },
  },
  created() {
    this.fasCaretRight = fasCaretRight;
  },
  methods: {
    onSequenceIndexUpdate(index) {
      if (index !== null && !this.expanded.includes(this.manifests[index]?.label)) {
        this.$store.dispatch(
          'contents/addToExpanded',
          this.manifests[index]?.label,
        );
      }
    },
    handleSelectedChange(value) {
      this.navigate(value);
    },
  },
};
</script>

<style scoped>
.item {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
}

.item-content {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  overflow: auto;
}

.q-tree {
  height: 100%;
}
</style>
