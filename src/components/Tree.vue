<template>
  <div class="item relative">
    <Loading v-if="isLoading" />
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
        <div v-if="!node.children" :id="`selectedItem-${node['label']}`" />
      </template>

      <template #default-header="prop">
        <div :id="prop.node['label']" class="row items-center">
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
import Loading from '@/components/Loading.vue';
import Navigation from '@/mixins/navigation';

export default {
  name: 'Tree',
  components: {
    Loading,
  },
  props: {
    labels: Object
  },
  mixins: [Navigation],
  data() {
    return {
      isLoading: false,
      expanded: [],
      selected: null,
      tree: []
    };
  },
  computed: {
    expandTreeNodes() {
      return this.$store.getters['contents/expanded'];
    },
    config() {
      return this.$store.getters['config/config'];
    },
    collectionTitle() {
      return this.$store.getters['contents/collectionTitle'];
    },
    collection() {
      return this.$store.getters['contents/collection'];
    },
    labels() {
      return this.config.labels || {};
    },
    itemUrl() {
      return this.$store.getters['contents/itemUrl'];
    },
    sequenceIndex() {
      return this.$store.getters['contents/selectedSequenceIndex'];
    },
    manifests() {
      return this.$store.getters['contents/manifests'];
    },
    loaded() {
      return this.$store.getters['contents/loaded'];
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
    // tree: {
    //   handler(value) {
    //     if (value.length > 0) {
    //       this.$store.dispatch('contents/addToExpanded', value[0].label);
    //     }
    //   },
    //   immediate: true,
    // },
  },
  created() {
    this.fasCaretRight = fasCaretRight;
  },
  async mounted() {
    this.isLoading = true;
    const { collection, manifest, item } = this.config;
    console.log(this.collection)
    if (collection) {
      let collectionObj = this.collection;
      if (!collectionObj) {
        await this.$store.dispatch('contents/initCollection');
        collectionObj = this.collection;
      }

      this.tree.push({
        children: [],
        handler: ({ label }) => {
          // dispatch('addOrRemoveFromExpanded', node.label);
          if (this.expanded.includes(label)) {
            this.removeFromExpanded(label);
          } else {
            this.addToExpanded(label);
          }
        },
        label: this.collectionTitle,
        'label-key': this.collectionTitle,
        selectable: false,
      });
    }
    this.isLoading = false;
  },
  methods: {
    addToExpanded(label) {
      this.expanded.push(label);
    },
    removeFromExpanded(label) {
      const index = this.expanded.indexOf(label);

      if (index > -1) {
        this.expanded.splice(index, 1);
      }
    },
    onSequenceIndexUpdate(index) {
      if (index !== null && !this.expanded.includes(this.manifests[index]?.label)) {
        this.$store.dispatch(
          'contents/addToExpanded',
          this.manifests[index]?.label,
        );
      }
    },
    handleSelectedChange(value) {
      // this.navigate(value);
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
