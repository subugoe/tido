<template>
  <div ref="containerRef" class="tree-view q-px-md q-pt-md">
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
      @lazy-load="onLazyLoad"
    >
      <template #default-header="{ node }">
        <div :id="node.url" class="row items-center">{{ node.label }}</div>
      </template>
    </q-tree>
  </div>
</template>

<script setup>
import { biChevronRight } from '@quasar/extras/bootstrap-icons';

import {
  computed, nextTick, ref, watch,
} from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { request } from '@/utils/http';
import { delay, isElementVisible } from '@/utils';

const emit = defineEmits(['loading']);

const expandIcon = biChevronRight;
const store = useStore();
const { t } = useI18n();

const expanded = ref([]);
const selected = ref(null);
const tree = ref([]);
const treeRef = ref(null);
const containerRef = ref(null);

const config = computed(() => store.getters['config/config']);
const collectionTitle = computed(() => store.getters['contents/collectionTitle']);
const collection = computed(() => store.getters['contents/collection']);
const labels = computed(() => (config.value && config.value.labels) || {});
const itemUrl = computed(() => store.getters['contents/itemUrl']);
const manifest = computed(() => store.getters['contents/manifest']);

watch(
  itemUrl,
  onItemUrlChange,
);
async function onItemUrlChange() {
  selected.value = itemUrl.value;
}

watch(
  collection,
  onCollectionChange,
  { immediate: true },
);
async function onCollectionChange() {
  if (collection.value) {
    emit('loading', true);
    tree.value = [{
      label: collectionTitle.value,
      selectable: false,
      url: collectionTitle.value,
      children: collection.value.sequence.map(({ label: manifestLabel, id: manifestId }, i) => ({
        label: manifestLabel ?? getDefaultManifestLabel(i),
        lazy: manifest.value.id !== manifestId,
        url: manifestId,
        selectable: false,
        // Prerender item tree elements for the manifest that should be open at initial load
        // and don't render children on every other manifest. They will be lazy loaded on expand.
        ...((manifest.value.id === manifestId)
          ? {
            children: manifest.value.sequence.map(({ id, label: itemLabel }, j) => ({
              label: itemLabel ?? getDefaultItemLabel(j),
              url: id,
              parent: manifestId,
            })),
          }
          : {}),
      }
      )),
    }];

    nextTick(() => {
      expanded.value = [collectionTitle.value, manifest.value.id];
      selected.value = itemUrl.value !== '' ? itemUrl.value : manifest.value.sequence[0]?.id;
    });
  }
}

watch(
  manifest,
  onManifestChange,
  { immediate: true },
);
async function onManifestChange() {
  const { label, sequence, id: manifestId } = manifest.value;
  if (!collection.value) {
    emit('loading', true);
    await delay(300);

    tree.value = [{
      label: label ?? getDefaultManifestLabel(),
      sequence,
      url: manifestId,
      selectable: false,
      children: (Array.isArray(sequence) ? sequence : [sequence]).map(({ id: itemId, label: itemLabel }, j) => ({
        label: itemLabel ?? getDefaultItemLabel(j),
        url: itemId,
        parent: manifestId,
      })),
    }];
  }

  nextTick(() => {
    const node = treeRef.value.getNodeByKey(manifestId);

    // We need to remove the lazy loading off of this manifest node and insert children manually,
    // because Quasar does not trigger lazy loading on this.expanded change.
    node.lazy = false;
    node.children = manifest.value.sequence.map(({ id, label: itemLabel }, j) => ({
      label: itemLabel ?? getDefaultItemLabel(j),
      url: id,
      parent: manifestId,
    }));
    expanded.value.push(manifestId);

    selected.value = itemUrl.value !== '' ? itemUrl.value : sequence[0]?.id;
  });
}

watch(
  selected,
  onSelectedChange,
  { immediate: true },
);
function onSelectedChange(value) {
  if (!treeRef.value) return;

  const node = treeRef.value.getNodeByKey(value);
  if (!node) return;

  const { url: _itemUrl, parent: _manifestUrl } = node;

  nextTick(async () => {
    await delay(600);
    const el = document.getElementById(itemUrl.value);
    if (el && !isElementVisible(el, containerRef.value)) {
      scrollIntoView(el);
    }
    await delay(100);
    emit('loading', false);
  });

  if (_itemUrl === itemUrl.value) return;

  if (_manifestUrl !== manifest.value.id) {
    store.dispatch('contents/initManifest', _manifestUrl);
    store.dispatch('config/setDefaultActiveViews');
    expanded.value.push(_manifestUrl);
  }

  if (!expanded.value.includes(_manifestUrl)) expanded.value.push(_manifestUrl);

  store.dispatch('contents/initItem', _itemUrl);
}

async function getManifest(url) {
  return request(url);
}

async function onLazyLoad({ node, fail, done }) {
  const { url, children } = node;
  if (!url) {
    done(children);
    return;
  }

  // eslint-disable-next-line no-shadow
  const manifest = await getManifest(url);

  if (!manifest) {
    fail();
    return;
  }

  const itemNodes = manifest.sequence.map(({ id, label: itemLabel }, j) => ({
    label: itemLabel ?? getDefaultItemLabel(j),
    url: id,
    parent: manifest.id,
  }));

  if (itemNodes) done(itemNodes);
  else fail();
}

function getDefaultManifestLabel(index) {
  const prefix = labels.value.manifest ?? t('manifest');
  return `${prefix} ${index !== undefined ? index + 1 : ''}`;
}

function getDefaultItemLabel(index) {
  const prefix = labels.value.item ?? t('page');
  return `${prefix} ${index + 1}`;
}

function scrollIntoView(el) {
  el.scrollIntoView({ block: 'center', behavior: 'smooth' });
}
</script>

<style scoped lang="scss">
.tree-view {
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
