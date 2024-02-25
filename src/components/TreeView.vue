<template>
  <div ref="containerRef" class="tree-view t-px-4 t-pt-4 t-h-full t-overflow-auto">
    <Tree
      v-model:expandedKeys="expanded"
      :selection-keys="selected"
      @update:selection-keys="onUpdateSelectionKeys"
      :value="tree"
      class="t-w-full"
      unstyled
      selectionMode="single"
      @node-expand="onNodeExpand"
      @node-select="onNodeSelect"
      :pt="{
      root: 't-relative',
      wrapper: 't-relative t-overflow-auto',
      filterContainer: 't-w-full t-relative t-mb-4',
      container: 't-me-4',
      // node: options => { log(options); return { },
      content: options => ({
        class: [
          't-flex t-py-2 t-pr-3 t-rounded-md t-cursor-pointer',
          't-relative',
          {'t-pl-8': !options.context.leaf || options.props.node.lazy },
          {'t-pl-3': options.context.leaf && !options.props.node.lazy },
          {'hover:t-bg-zinc-200 dark:hover:t-bg-zinc-700': !options.context.selected },
          {'t-bg-primary t-text-gray-100': options.context.selected }
        ]
      }),

      // content: 't-flex t-py-2 t-px-3 t-rounded-md hover:t-bg-zinc-200 dark:hover:t-bg-zinc-700 t-cursor-pointer',
      toggler: options => ({
        class: [
          't-border-0 t-absolute t-left-0 t-w-full t-pl-3 t-text-left',
          { 't-hidden': options.context.leaf && !options.props.node.lazy }
        ]
      }),
      label: 't-cursor-pointer t-select-none',
      subgroup: 't-ps-4',
      loadingOverlay: 't-absolute t-z-10 t-w-full t-h-full t-flex t-items-center t-justify-center t-bg-white dark:t-bg-zinc-800 t-bg-opacity-75 dark:t-bg-opacity-75'
    }"
    >
      <template #default="{ node }"><span :id="node.key">{{ node.label }}</span></template>
    </Tree>
  </div>
</template>

<script setup>
import Tree from 'primevue/tree';

import {
  computed, nextTick, onMounted, ref, watch,
} from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { request } from '@/utils/http';
import { delay, isElementVisible } from '@/utils';

const emit = defineEmits(['loading']);

const store = useStore();
const { t } = useI18n();

const expanded = ref({});
const selected = ref(null);
const tree = ref([]);
const containerRef = ref(null);

const config = computed(() => store.getters['config/config']);
const collectionTitle = computed(() => store.getters['contents/collectionTitle']);
const collection = computed(() => store.getters['contents/collection']);
const labels = computed(() => (config.value && config.value.labels) || {});
const itemUrl = computed(() => store.getters['contents/itemUrl']);
const currentManifest = computed(() => store.getters['contents/manifest']);

onMounted(() => {
  emit('loading', true);
  if (collection.value) {
    createCollectionRoot();
    expanded.value = { ...expanded.value, [currentManifest.value.id]: true };
    insertManifestChildren(currentManifest.value);
    selected.value = { [itemUrl.value !== '' ? itemUrl.value : currentManifest.value.sequence[0]?.id]: true };
  } else if (currentManifest.value) {
    createManifestRoot();
  }

  emit('loading', false);

  scrollSelectedIntoView();
});

watch(currentManifest, (value) => {
  const node = getNodeByKey(value.id);
  if (!node || node.children?.length > 0) return;
  expanded.value = { ...expanded.value, [value.id]: true };
  insertManifestChildren(value);
});

watch(itemUrl, (value) => {
  console.log('watch itemUrl');

  console.log(value);
  selected.value = { [value]: true };
});

function log(any) {
  // console.log(any);
}

function onUpdateSelectionKeys(selectionKeys) {
  if (!Object.keys(selectionKeys).length) return;
  selected.value = selectionKeys;
}

async function createCollectionRoot() {
  tree.value = [{
    key: collectionTitle.value,
    label: collectionTitle.value,
    selectable: false,
    url: collectionTitle.value,
    children: collection.value.sequence.map(({ label: manifestLabel, id: manifestId }, i) => ({
      key: manifestId,
      label: manifestLabel ?? getDefaultManifestLabel(i),
      lazy: true,
      url: manifestId,
      selectable: false,
      type: 'manifest',
    }
    )),
  }];

  expanded.value = { ...expanded.value, [collectionTitle.value]: true };
}

async function createManifestRoot() {
  const { label, sequence, id: manifestId } = currentManifest.value;

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

function insertManifestChildren(manifest) {
  const node = getNodeByKey(manifest.id, tree.value[0]);
  node.children = manifest.sequence.map(({ id, label: itemLabel }, j) => ({
    key: id,
    label: itemLabel ?? getDefaultItemLabel(j),
    url: id,
    parent: manifest.id,
    leaf: true,
    selectable: true,
  }));
}

async function onNodeExpand(node) {
  if (currentManifest.value.id === node.key) return;
  const manifest = await getManifest(node.key);
  insertManifestChildren(manifest);
}

async function onNodeSelect(node) {
  await store.dispatch('contents/initItem', node.key);

  if (currentManifest.value.id === node.parent) return;

  await store.dispatch('contents/initManifest', node.parent);
  await store.dispatch('config/setDefaultActiveViews');
}

function scrollSelectedIntoView() {
  nextTick(() => {
    const el = document.getElementById(itemUrl.value);
    if (el && !isElementVisible(el, containerRef.value)) {
      scrollIntoView(el);
    }
  });
}

async function getManifest(url) {
  return request(url);
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

function getNodeByKey(key, root) {
  if (!root) [root] = tree.value;
  if (root.url === key) return root;
  if (!root.children) return null;

  return root.children.find((child) => !!(getNodeByKey(key, child)));
}
</script>
