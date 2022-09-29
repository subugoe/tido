<template>
  <div class="item relative">
    <Loading v-if="isLoading" />
    <q-tree
      ref="treeRef"
      v-model:expanded="expanded"
      v-model:selected="selected"
      :icon="fasCaretRight"
      :nodes="tree"
      :selected-color="$q.dark.isActive ? 'grey' : ''"
      node-key="label"
      @lazy-load="onLazyLoad"
    >
<!--      <template #default-body="{ node }">-->
<!--        <div v-if="!node.children" :id="`selectedItem-${node['label']}`" />-->
<!--      </template>-->

<!--      <template #default-header="prop">-->
<!--        <div :id="prop.node['label']" class="row items-center">-->
<!--          <div>-->
<!--            {{ prop.node.labelSheet ? $t(labels.item) : '' }}-->
<!--            {{ prop.node['label-key'] }}-->
<!--          </div>-->
<!--        </div>-->
<!--      </template>-->
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
  data() {
    return {
      isLoading: false,
      expanded: [],
      selected: null,
      tree: [],
      treeRef: null
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
    item() {
      return this.$store.getters['contents/item'];
    },
    itemUrl() {
      return this.$store.getters['contents/itemUrl'];
    },
    manifest() {
      return this.$store.getters['contents/manifest'];
    },
    manifests() {
      return this.$store.getters['contents/manifests'];
    },
    loaded() {
      return this.$store.getters['contents/loaded'];
    },
  },
  watch: {
    collection: {
      handler: 'onCollectionChange',
      immediate: true
    },
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
    expanded: {
      handler(value) {
        console.log(value);
        // this.expanded = [...value];
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
    addOrRemoveFromExpanded(label) {
      if (this.expanded.includes(label)) {
        this.removeFromExpanded(label);
      } else {
        this.addToExpanded(label);
      }
    },
    onLazyLoad({ node, key, done, fail }) {
      let { sequence } = node;
      sequence = Array.isArray(sequence) ? sequence : [sequence];
      done(sequence.map((seqItem, i) => ({label: seqItem.label ?? this.getDefaultLabel(i)})))
    },
    async onCollectionChange() {
      this.isLoading = true;
      console.log('onCollectionChange');

      if (this.collection) {
        this.tree = [{
          label: this.collectionTitle,
          selectable: false,
          children: this.manifests.map(({ sequence, label }) => ({
              label,
              sequence,
              selectable: false,
              lazy: true
              // handler: ({ label }) => {
              //   this.addOrRemoveFromExpanded(label);
              // }
            }
          )),
          // handler: ({ label }) => {
          //   this.addOrRemoveFromExpanded(label);
          // },
        }];

        console.log(this.$ref, this.$refs);
        this.treeRef.setExpanded(this.collectionTitle, true);
        //this.expanded = [this.collectionTitle, this.manifest.label];
        this.selected = [this.item.label]

      }
      this.isLoading = false;
    },
    getDefaultLabel(index) {
      const prefix = this.labels.item ?? this.$t('page');
      return prefix + ' ' + (index + 1);
    },
    onSequenceIndexUpdate(index) {
      // if (index !== null && !this.expanded.includes(this.manifests[index]?.label)) {
      //   this.$store.dispatch(
      //     'contents/addToExpanded',
      //     this.manifests[index]?.label,
      //   );
      // }
    },
    handleSelectedChange(value) {
      console.log(value);
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
