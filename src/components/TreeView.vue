<template>
  <div ref="containerRef" class="tree-view t-px-4 t-pt-4 t-h-full t-overflow-auto">
<!--    <q-tree-->
<!--      class="item-content"-->
<!--      :class="$q.dark.isActive ? 'is-dark' : ''"-->
<!--      ref="treeRef"-->
<!--      v-model:expanded="expanded"-->
<!--      v-model:selected="selected"-->
<!--      :icon="expandIcon"-->
<!--      :nodes="tree"-->
<!--      :selected-color="$q.dark.isActive ? 'grey' : ''"-->
<!--      node-key="url"-->
<!--      @lazy-load="onLazyLoad"-->
<!--    >-->
<!--      <template #default-header="{ node }">-->
<!--        <div :id="node.url" class="row items-center">{{ node.label }}</div>-->
<!--      </template>-->
<!--    </q-tree>-->
    <Tree
      v-model:expandedKeys="expanded"
      :selection-keys="selected"
      @update:selection-keys="selectNode"
      :value="tree"
      class="t-w-full"
      unstyled
      selectionMode="single"
      @node-expand="onLazyLoad"
      @node-select="onSelectedChange"
      :pt="{
      root: 't-relative',
      wrapper: 't-relative t-overflow-auto',
      filterContainer: 't-w-full t-relative t-mb-4',
      // filterInput: 'w-full p-2 dark:bg-zinc-700 border dark:border-zinc-500 rounded-lg transition colors ' +
      //  'hover:border-primary dark:hover:border-primary ' +
      //  'outline-none focus:ring-2 focus:border-primary focus:ring-primary-100 dark:focus:ring-primary',
      // searchIcon: 'w-4 h-4 absolute right-3 top-1/2 -mt-2',
      // checkboxContainer: 'me-2',
      // checkbox: options => { return {
      //   class: [
      //     'border-2 rounded-md w-[22px] h-[22px] transition-colors flex items-center justify-center',
      //     {
      //       'bg-zinc-50 dark:bg-zinc-700 dark:border-zinc-600 hover:border-primary dark:hover:border-primary': !options.context.checked,
      //       'bg-primary border-primary dark:border-primary text-white hover:bg-primary-700': options.context.checked,
      //     }
      //   ]
      // }},
      container: 't-me-4',
      // node: options => { log(options); return { },
      content: options => ({
        class: [
          't-flex t-py-2 t-px-3 t-rounded-md t-cursor-pointer',
          {'hover:t-bg-zinc-200 dark:hover:t-bg-zinc-700': !options.context.selected },
          {'t-bg-primary t-text-gray-100': options.context.selected }
        ]
      }),

      // content: 't-flex t-py-2 t-px-3 t-rounded-md hover:t-bg-zinc-200 dark:hover:t-bg-zinc-700 t-cursor-pointer',
      toggler: options => { return { class: ['t-border-0 t-me-2', { 't-hidden': options.context.leaf && !options.props.node.lazy }] } },
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

const isLoading = ref(false);
const expanded = ref({});
const selected = ref(null);
const tree = ref([]);
const treeRef = ref(null);
const containerRef = ref(null);

const config = computed(() => store.getters['config/config']);
const collectionTitle = computed(() => store.getters['contents/collectionTitle']);
const collection = computed(() => store.getters['contents/collection']);
const labels = computed(() => (config.value && config.value.labels) || {});
const item = computed(() => store.getters['contents/item']);
const itemUrl = computed(() => store.getters['contents/itemUrl']);
const manifest = computed(() => store.getters['contents/manifest']);
const manifests = computed(() => store.getters['contents/manifests']);

function log(any) {
  console.log(any);
}

watch(collection, onCollectionChange, { immediate: true });
watch(manifest, onManifestChange, { immediate: true });
watch(itemUrl, onItemUrlChange);
watch(selected, scrollSelectedIntoView, { immediate: true });

async function onItemUrlChange() {
  selected.value = { [itemUrl.value]: true };
}

function selectNode(value) {
  if (!Object.keys(value).length) return;
  selected.value = value;
}

async function onCollectionChange() {
  console.log('onCollectionChange');
  if (!collection.value) return;
  emit('loading', true);
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
      // Prerender item tree elements for the manifest that should be open at initial load
      // ...((manifest.value.id === manifestId)
      //   ? {
      //     children: manifest.value.sequence.map(({ id, label: itemLabel }, j) => ({
      //       key: id,
      //       label: itemLabel ?? getDefaultItemLabel(j),
      //       url: id,
      //       parent: manifestId,
      //       leaf: true,
      //       children: [],
      //       selectable: true,
      //     })),
      //   }
      //   : {}),
    }
    )),
  }];

  nextTick(() => {
    expanded.value = { ...expanded.value, [collectionTitle.value]: true };
    // selected.value = { [itemUrl.value !== '' ? itemUrl.value : manifest.value.sequence[0]?.id]: true };
    console.log(selected.value);
  });
}

async function onManifestChange() {
  console.log('onManifestChange');
  const { label, sequence, id: manifestId } = manifest.value;
  if (!collection.value) {
    // If no collection is present it means that the manifest is our root node
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

  const node = getNodeByKey(manifestId, tree.value[0]);
  console.log(node);
  node.children = manifest.value.sequence.map(({ id, label: itemLabel }, j) => ({
    key: id,
    label: itemLabel ?? getDefaultItemLabel(j),
    url: id,
    parent: manifestId,
    leaf: true,
    selectable: true,
  }));
  expanded.value = { ...expanded.value, [manifestId]: true };
  selected.value = { [itemUrl.value !== '' ? itemUrl.value : sequence[0]?.id]: true };
}

function onSelectedChange(node) {
  console.log('onSelectedChange', node);
  // return;
  // if (!treeRef.value) return;

  // if (!node) return;
  // console.log(node);

  // const node = treeRef.value.getNodeByKey(value);
  // if (!node) return;

  const { url: _itemUrl, parent: _manifestUrl } = node;

  // nextTick(async () => {
  //   await delay(600);
  //   const el = document.getElementById(itemUrl.value);
  //   if (el && !isElementVisible(el, containerRef.value)) {
  //     scrollIntoView(el);
  //   }
  //   await delay(100);
  //   emit('loading', false);
  // });

  // if (_itemUrl === itemUrl.value) return;

  if (_manifestUrl !== manifest.value.id) {
    store.dispatch('contents/initManifest', _manifestUrl);
    store.dispatch('config/setDefaultActiveViews');
    expanded.value = { ...expanded.value, [_manifestUrl]: true };
  }

  // if (!expanded.value.includes(_manifestUrl)) expanded.value.push(_manifestUrl);

  store.dispatch('contents/initItem', _itemUrl);
}

function scrollSelectedIntoView() {
  nextTick(() => {
    const el = document.getElementById(itemUrl.value);
    console.log(el);
    if (el && !isElementVisible(el, containerRef.value)) {
      scrollIntoView(el);
    }
  });
}

async function getManifest(url) {
  return request(url);
}

async function onLazyLoad(node) {
  console.log('onLazyLoad');
  const { url } = node;
  const manifest = await getManifest(url);

  node.children = manifest.sequence.map(({ id, label: itemLabel }, j) => ({
    label: itemLabel ?? getDefaultItemLabel(j),
    url: id,
    parent: manifest.id,
  }));
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
  console.log(root.url, key);
  if (root.url === key) return root;
  if (!root.children) return null;

  return root.children.find((child) => !!(getNodeByKey(key, child)));
}
</script>
