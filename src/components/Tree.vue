<template>
  <div class="item relative">
    <Loading v-if="isLoading" />
    <q-tree
      v-show="!isLoading"
      class="item-content"
      ref="treeRef"
      v-model:expanded="expanded"
      v-model:selected="selected"
      :icon="fasCaretRight"
      :nodes="tree"
      :selected-color="$q.dark.isActive ? 'grey' : ''"
      node-key="url"
    >
<!--      <template #default-body="{ node }">-->
<!--        <div v-if="!node.children" :id="`selectedItem-${node['label']}`">{{ node.label }}</div>-->
<!--      </template>-->

      <template #default-header="{ node }">
        <div :id="node.url" class="row items-center">
          <div>
            {{ node.label }}
          </div>
        </div>
      </template>
    </q-tree>
  </div>
</template>

<script>
import { fasCaretRight } from '@quasar/extras/fontawesome-v5';
import Loading from '@/components/Loading.vue';

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
  },
  watch: {
    itemUrl: {
      handler: 'onItemUrlChange'
    },
    collection: {
      handler: 'onCollectionChange',
      immediate: true
    },
    selected: {
      handler: 'onSelectedChange',
      immediate: true,
    },
    expanded: {
      handler(value) {
        console.log(value);
        // this.expanded = [...value];
      },
      immediate: true,
    },
  },
  created() {
    this.fasCaretRight = fasCaretRight;
  },
  async mounted() {
    console.log('tree mounted')
  },
  methods: {
    async onCollectionChange() {
      this.isLoading = true;
      if (this.collection) {
        this.tree = [{
          label: this.collectionTitle,
          selectable: false,
          url: this.collectionTitle,
          children: this.manifests.map(({ sequence, label, id: manifestId }) => ({
              label,
              sequence,
              url: manifestId,
              selectable: false,
              children: (Array.isArray(sequence) ? sequence : [sequence]).map(({ id, label }, i) => ({
                label: label ?? this.getDefaultLabel(i),
                url: id,
                parent: manifestId
              }))
            }
          )),
        }];

        await this.$nextTick(() => {
          this.expanded = [this.collectionTitle, this.manifest.id];
          this.selected = this.itemUrl !== '' ? this.itemUrl : this.manifest.sequence[0]?.id;
        });
      }
    },
    async onItemUrlChange() {
      this.selected = this.itemUrl;
    },
    getDefaultLabel(index) {
      const prefix = this.labels.item ?? this.$t('page');
      return prefix + ' ' + (index + 1);
    },
    onSelectedChange(value) {
      const { treeRef } = this.$refs;

      if (!treeRef) return;

      const node = treeRef.getNodeByKey(value);

      if (!node) return;

      const {url: itemUrl, parent: manifestUrl } = node;

      this.$nextTick(() => {
        document.getElementById(this.itemUrl).scrollIntoView({ block: 'center' });
        setTimeout(() => this.isLoading = false, 400)
      });

      if (itemUrl === this.itemUrl) {
        return;
      }

      if (manifestUrl !== this.manifest.id) {
        this.$store.dispatch('contents/initManifest', manifestUrl);
        // if (this.manifests) {
        //   this.$store.commit('contents/setManifest', this.manifests.find(({ id }) => id === manifestUrl));
        // } else {
        // }
      }

      this.$store.dispatch('contents/initItem', itemUrl);
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
