<template>
  <div ref="containerRef" class="tree-container q-px-md q-pt-md">
    <q-tree
      class="item-content"
      :class="$q.dark.isActive ? 'is-dark' : ''"
      ref="treeRef"
      v-model:expanded="expanded"
      v-model:selected="selected"
      :icon="expandIcon"
      :nodes="tree"
      :selected-color="$q.dark.isActive ? 'grey' : ''"
      node-key="url"
      @after-show="onAfterShow"
      @lazy-load="onLazyLoad"
      @update:expanded="onUpdateExpanded"
    >
      <template #default-header="{ node }">
        <div :id="node.url" class="row items-center">{{ node.label }}</div>
      </template>
    </q-tree>
  </div>
</template>

<script>
import { biChevronRight } from '@quasar/extras/bootstrap-icons';
import { delay, isElementVisible } from '@/utils';
import { request } from '@/utils/http';

async function getManifest(url) {
  const data = await request(url);
  return data;
}

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
        console.log(this.manifest);
        this.$emit('loading', true);
        this.tree = [{
          label: this.collectionTitle,
          selectable: false,
          url: this.collectionTitle,
          children: this.collection.sequence.map(({ label: manifestLabel, id: manifestId }, i) => ({
            label: manifestLabel ?? this.getDefaultManifestLabel(i),
            lazy: this.manifest.id !== manifestId,
            url: manifestId,
            selectable: false,
            // Prerender item tree elements for the manifest that should be open at initial load
            // and don't render children on every other manifest. They will be lazy loaded on expand.
            ...((this.manifest.id === manifestId)
              ? {
                children: this.manifest.sequence.map(({ id, label: itemLabel }, j) => ({
                  label: itemLabel ?? this.getDefaultItemLabel(j),
                  url: id,
                  parent: manifestId,
                })),
              }
              : {}),
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
      const { label, sequence, id: manifestId } = this.manifest;
      if (!this.collection) {
        this.$emit('loading', true);
        await delay(300);

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
      }

      this.$nextTick(() => {
        const node = this.$refs.treeRef.getNodeByKey(manifestId);

        // We need to remove the lazy loading off of this manifest node and insert children manually,
        // because Quasar does not trigger lazy loading on this.expanded change.
        node.lazy = false;
        node.children = this.manifest.sequence.map(({ id, label: itemLabel }, j) => ({
          label: itemLabel ?? this.getDefaultItemLabel(j),
          url: id,
          parent: manifestId,
        }));
        this.expanded.push(manifestId);

        this.selected = this.itemUrl !== '' ? this.itemUrl : sequence[0]?.id;
      });
    },
    async onItemUrlChange() {
      this.selected = this.itemUrl;
    },
    async onAfterShow() {
      await delay(100);
      const el = document.getElementById(this.itemUrl);
      console.log(el)
      if (el && !isElementVisible(el, this.$refs.containerRef)) {
        this.scrollIntoView(el);
      }
    },
    async onLazyLoad({ node, fail, done }) {
      const { url, children } = node;
      if (!url) {
        done(children);
        return;
      }

      const manifest = await getManifest(url);

      if (!manifest) {
        fail();
        return;
      }

      const itemNodes = manifest.sequence.map(({ id, label: itemLabel }, j) => ({
        label: itemLabel ?? this.getDefaultItemLabel(j),
        url: id,
        parent: manifest.id,
      }));

      if (itemNodes) done(itemNodes);
      else fail();
    },
    onSelectedChange(value) {
      const { treeRef } = this.$refs;
      if (!treeRef) return;

      const node = treeRef.getNodeByKey(value);
      if (!node) return;

      const { url: itemUrl, parent: manifestUrl } = node;

      this.$nextTick(async () => {
        await delay(300);
        const el = document.getElementById(this.itemUrl);
        if (el && !isElementVisible(el, this.$refs.containerRef)) {
          this.scrollIntoView(el);
        }
        await delay(100);
        this.$emit('loading', false);
      });

      if (itemUrl === this.itemUrl) return;

      if (manifestUrl !== this.manifest.id) {
        this.$store.dispatch('contents/initManifest', manifestUrl);
        this.$store.dispatch('config/setDefaultActiveViews');
        this.expanded.push(manifestUrl);
      }

      if (!this.expanded.includes(manifestUrl)) this.expanded.push(manifestUrl);

      this.$store.dispatch('contents/initItem', itemUrl);
    },
    getDefaultManifestLabel(index) {
      const prefix = this.labels.manifest ?? this.$t('manifest');
      return `${prefix} ${index !== undefined ? index + 1 : ''}`;
    },
    getDefaultItemLabel(index) {
      const prefix = this.labels.item ?? this.$t('page');
      return `${prefix} ${index + 1}`;
    },
    scrollIntoView(el) {
      console.log('scroll')
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    },
  },
};
</script>

<style scoped lang="scss">
.tree-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: auto;

  :deep(.item-content) {
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    overflow: auto;
    .q-tree {
      height: 100%;
      > .q-tree__node--child {
        > .q-tree__node-header {
          padding-left: 8px;
        }
      }
    }

    .q-tree__node {
      &:first-child {
        margin-top: 3px;
      }
      margin-bottom: 3px;
      padding-bottom: 0;
    }

    .q-tree__node-body.relative-position {
      padding: 0;
    }

    .q-tree__node-collapsible .q-tree__children {
      > .q-tree__node--parent {
        > .q-tree__node-header {
          background-color: $grey-2;
          left: 0;
          position: sticky;
          top: 0;
          z-index: 1;
        }
      }
    }

    &.q-tree--dark .q-tree__node-collapsible .q-tree__children {
      > .q-tree__node--parent {
        > .q-tree__node-header {
          background-color: $grey-8 !important;
        }
      }
    }

    .q-tree__node--selected {
      background-color: var(--q-primary);
      @media (prefers-color-scheme: dark) {
        background-color: $grey-3;
      }

      .q-tree__node-header-content {
        color: $light !important;
        @media (prefers-color-scheme: dark) {
          color: $dark !important;
        }
      }
    }

    .q-tree__node-header {
      border-radius: 3px;
      > * {
        padding: 0;
      }
      .q-tree__node-header-content {
        transition: none;
        flex-wrap: unset;

        > * {
          padding: 0;
        }
      }
      .q-icon {
        // Safari fix
        width: 16px;
        height: 16px;
      }
    }

    .q-tree__children {
      cursor: pointer;
    }

    .q-tree__node-header-content {
      word-break: break-all;
      user-select: none;
      margin-left: 4px;
    }
  }
}

</style>
