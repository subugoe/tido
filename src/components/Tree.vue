<template>
  <div class="tree-container">
    <q-tree
      class="item-content"
      ref="treeRef"
      v-model:expanded="expanded"
      v-model:selected="selected"
      :icon="expandIcon"
      :nodes="tree"
      :selected-color="$q.dark.isActive ? 'grey' : ''"
      node-key="url"
      @after-show="onAfterShow"
    >
      <template #default-header="{ node }">
        <div :id="node.url" class="row items-center">{{ node.label }}</div>
      </template>
    </q-tree>
  </div>
</template>

<script>
import { delay } from 'src/utils';
import { biChevronRight } from '@quasar/extras/bootstrap-icons';

export default {
  name: 'Tree',
  data() {
    return {
      isLoading: false,
      expanded: [],
      selected: null,
      tree: [],
      treeRef: null,
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
      handler: 'onItemUrlChange',
    },
    collection: {
      handler: 'onCollectionChange',
      immediate: true,
    },
    manifest: {
      handler: 'onManifestChange',
      immediate: true,
    },
    selected: {
      handler: 'onSelectedChange',
      immediate: true,
    },
  },
  created() {
    this.expandIcon = biChevronRight;
  },
  methods: {
    async onCollectionChange() {
      if (this.collection) {
        this.$emit('loading', true);
        this.tree = [{
          label: this.collectionTitle,
          selectable: false,
          url: this.collectionTitle,
          children: this.manifests.map(({ sequence, label: manifestLabel, id: manifestId }, i) => ({
            label: manifestLabel ?? this.getDefaultManifestLabel(i),
            sequence,
            url: manifestId,
            selectable: false,
            children: (Array.isArray(sequence) ? sequence : [sequence]).map(({ id, label: itemLabel }, j) => ({
              label: itemLabel ?? this.getDefaultItemLabel(j),
              url: id,
              parent: manifestId,
            })),
          }
          )),
        }];

        this.$nextTick(() => {
          this.expanded = [this.collectionTitle, this.manifest.id];
          this.selected = this.itemUrl !== '' ? this.itemUrl : this.manifest.sequence[0]?.id;
        });
      }
    },
    async onManifestChange() {
      if (this.manifest && !this.collection) {
        this.$emit('loading', true);
        await delay(300);
        const { label, sequence, id: manifestId } = this.manifest;
        this.tree = [{
          label: label ?? this.getDefaultManifestLabel(),
          sequence,
          url: manifestId,
          selectable: false,
          children: (Array.isArray(sequence) ? sequence : [sequence]).map(({ id: itemId, label: itemLabel }, j) => ({
            label: itemLabel ?? this.getDefaultItemLabel(j),
            url: itemId,
            parent: manifestId,
          })),
        }];

        this.$nextTick(() => {
          this.expanded = [manifestId];
          this.selected = this.itemUrl !== '' ? this.itemUrl : sequence[0]?.id;
        });
      }
    },
    async onItemUrlChange() {
      this.selected = this.itemUrl;
    },
    getDefaultManifestLabel(index) {
      const prefix = this.labels.manifest ?? this.$t('manifest');
      return `${prefix} ${index !== undefined ? index + 1 : ''}`;
    },
    getDefaultItemLabel(index) {
      const prefix = this.labels.item ?? this.$t('page');
      return `${prefix} ${index + 1}`;
    },
    onSelectedChange(value) {
      const { treeRef } = this.$refs;
      if (!treeRef) return;

      const node = treeRef.getNodeByKey(value);
      if (!node) return;

      const { url: itemUrl, parent: manifestUrl } = node;

      this.$nextTick(() => {
        document.getElementById(this.itemUrl).scrollIntoView({ block: 'center' });
        setTimeout(() => this.$emit('loading', false), 400);
      });

      // if (itemUrl === this.itemUrl) return;

      if (manifestUrl !== this.manifest.id) {
        this.$store.dispatch('contents/initManifest', manifestUrl);
        this.$store.dispatch('config/setDefaultActiveViews');
        this.expanded.push(manifestUrl);
      }

      if (!this.expanded.includes(manifestUrl)) this.expanded.push(manifestUrl);
      this.$nextTick(() => {
        document.getElementById(this.itemUrl).scrollIntoView({ block: 'center' });
      });

      this.$store.dispatch('contents/initItem', itemUrl);
    },
    onAfterShow() {
      document.getElementById(this.itemUrl).scrollIntoView({ block: 'center' });
    },
  },
};
</script>

<style scoped>
.tree-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  position: relative;
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
