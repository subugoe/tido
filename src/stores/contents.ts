import { defineStore } from 'pinia';
import {
  computed, ref,
} from 'vue';

import { request } from '@/utils/http';
import { i18n } from '@/i18n';
import BookmarkService from '@/services/bookmark';
import { loadCss, loadFont } from '../utils';
import { useConfigStore } from '@/stores/config';
import { useAnnotationsStore } from '@/stores/annotations';

export const useContentsStore = defineStore('contents', () => {
  const activeContentMap = ref<{[key: string]: string}>({});
  const collection = ref<Collection>(null);
  const item = ref<Item | null>(null);
  const itemUrl = ref<string | null>(null);
  const manifests = ref<Manifest[]>(null);
  const manifest = ref<Manifest>(null);

  const collectionTitle = computed<string | null>(() => {
    if (!collection.value) return null;

    if (Object.keys(collection.value).length) {
      return collection.value.title[0].title
        ? collection.value.title[0].title
        : 'Undefined collection title';
    }

    return 'Manifest <small>(No label available)</small>';
  });

  const itemIndex = computed<number>(() => {
    if (!manifest.value) return -1;
    return manifest.value.sequence.findIndex((item) => item.id === itemUrl.value);
  });

  function setCollection(payload: Collection) {
    collection.value = { ...payload };
  }

  function setItem(payload: Item) {
    item.value = payload;
  }

  function setItemUrl(payload: string) {
    itemUrl.value = payload;
  }

  function setManifests(payload: Manifest[]) {
    manifests.value = payload;
  }

  function setManifest(payload: Manifest) {
    if (!Array.isArray(payload.sequence)) payload.sequence = [payload.sequence];
    manifest.value = { ...payload };
  }

  function setActiveContentMap(payload: string, panelIndex: number) {
    activeContentMap.value = { ...activeContentMap.value, [panelIndex]: payload } ;
  }

  function findActiveManifestIndex(manifests: Manifest[] = [], itemUrl: string | null): number {
    if (manifests === null) return -1;
    if (manifests.length === 0) return -1;
    if (!itemUrl) return 0;

    itemUrl = encodeURI(decodeURI(itemUrl));

    return manifests.findIndex(({ sequence }) => {
      sequence = Array.isArray(sequence) ? sequence : [sequence];
      return sequence.find(({ id }) => encodeURI(decodeURI(id)) === itemUrl);
    });
  }

  function findManifestIndexOfManifestInConfig(resultConfig) {
    // Url of manifest is given in resultConfig as 'manifest'
    const manifestUrl = resultConfig.manifest;
    return manifests.value.findIndex((element) => element.id === manifestUrl);
  }

  async function getManifest(url: string): Promise<Manifest> {
    const data: Manifest = await request(url);
    return data;
  }

  function isManifestPartInsideRangeValue(m: number, numberManifests: number) {
    return (m >= 0 && m < numberManifests);
  }

  function isItemPartInsideRangeValue(i: number, numberItems: number) {
    return (i >= 0 && i < numberItems);
  }

  const initCollection = async (url: string) => {
    const configStore = useConfigStore();
    const contentStore = useContentsStore();
    const resultConfig = configStore.config;
    let { item: itemUrl } = resultConfig;
    let collection: Collection;
    let activeManifest: Manifest;
    let manifestIndex: number;
    let itemIndex: number;

    try {
      collection = await request(url);
    } catch (err) {
      throw new Error(i18n.global.t('error_collection_url'));
    }
    contentStore.setCollection(collection);

    const numberManifests: number = Object.keys(collection).length > 0 ? collection.sequence.length : 0;

    if (numberManifests === 0) {
      throw new Error(i18n.global.t('error_no_manifests_in_initCollection'));
    }
    if ('m' in resultConfig) {
      if (!isManifestPartInsideRangeValue(resultConfig.m, numberManifests)) {
        throw new Error(`Please enter 'm' as integer in this range [0,${numberManifests})`);
      }
    }

    if (Array.isArray(collection.sequence) && collection.sequence.length > 0) {
      const promises = [];
      collection.sequence.forEach((seq) => promises.push(getManifest(seq.id)));
      const manifests: Manifest[] = await Promise.all(promises);
      contentStore.setManifests(manifests);

      if ('m' in resultConfig && 'i' in resultConfig) {
        // Check if manifestIndex or item Index are part of the result config
        manifestIndex = resultConfig.m;
        itemIndex = resultConfig.i;
      } else if ('m' in resultConfig) {
        manifestIndex = resultConfig.m;
        itemIndex = 0;
      } else if ('i' in resultConfig) {
        itemIndex = resultConfig.i;
        if ('manifest' in resultConfig && resultConfig.manifest !== '') {
          // Find the manifest Index of this manifest in this collection
          manifestIndex = findManifestIndexOfManifestInConfig(resultConfig);
        } else {
          manifestIndex = 0;
        }
      } else if ('manifest' in resultConfig && resultConfig.manifest !== '') {
        manifestIndex = findManifestIndexOfManifestInConfig(resultConfig);
        itemIndex = 0;
      } else {
        [manifestIndex, itemIndex] = [0, 0];
      }

      const numberItems = manifests[manifestIndex].sequence.length;
      if (!isItemPartInsideRangeValue(itemIndex, numberItems)) {
        throw new Error(`Please enter 'i' as integer in this range [0,${numberItems})`);
      }

      activeManifest = manifests[manifestIndex];
      itemUrl = activeManifest.sequence[itemIndex].id;
      const { support } = activeManifest;

      if (support && support.length > 0) {
        await contentStore.getSupport(support);
      }

      contentStore.setManifest(activeManifest);
      contentStore.initItem(itemUrl);
    }
  };

  const initManifest = async (url: string) => {
    const contentStore = useContentsStore();
    let manifest: Manifest;
    let itemUrl: string;
    let itemIndex: number;
    const configStore = useConfigStore();

    try {
      manifest = await request(url);
    } catch (err) {
      throw new Error(i18n.global.t('error_manifest_url'));
    }
    if (Array.isArray(manifest.sequence) && manifest.sequence.length <= 0) {
      throw new Error(i18n.global.t('error_no_items_in_manifest'));
    }

    const numberItems: number = manifest.sequence.length;
    contentStore.setManifest(manifest);
    const resultConfig = configStore.config;
    itemUrl = resultConfig.item;

    if ('collection' in resultConfig && resultConfig.collection === '') {
      // we make sure that this error doesn't occur when switching manifest (the condition 'm' & 'i' in resultConfig)
      if (('m' in resultConfig && 'i' in resultConfig) || 'm' in resultConfig) {
        throw new Error(i18n.global.t('error_m_in_url_no_collection'));
      }
    }
    if ('i' in resultConfig && 'm' in resultConfig === false) {
      // when the we switch to an item in a new manifest
      itemIndex = resultConfig.i;
    } else if (itemUrl !== '') {
      // find the item index in this manifest
      itemIndex = manifest.sequence.findIndex((element) => element.id === itemUrl);
      if (itemIndex === -1) {
        // if the item is not found, then show errors
        throw new Error(i18n.global.t('error_item_not_in_manifest'));
      }
    } else if (resultConfig.manifest !== '') {
      itemIndex = 0;
    }

    const { support } = manifest;
    if (support && support.length > 0) {
      await contentStore.getSupport(support);
    }

    if (itemIndex !== undefined) {
      if (!isItemPartInsideRangeValue(itemIndex, numberItems)) {
        throw new Error(`Please enter 'i' as integer in this range [0,${numberItems})`);
      }
      itemUrl = manifest.sequence[itemIndex].id;
      await contentStore.initItem(itemUrl);
    }
  };

  const initItem = async (url: string) => {
    const annotationStore = useAnnotationsStore();
    const contentStore = useContentsStore();
    let item: Item;

    try {
      item = await request(url);
    } catch (err) {
      throw new Error(i18n.global.t('error_item_url'));
    }
    contentStore.setItem(item);
    contentStore.setItemUrl(url);

    if (item.annotationCollection) {
      await annotationStore.initAnnotations(item.annotationCollection);
    }
    // here we have item query -> we should extract the manifest index and the item index from the query and then give it as a parameter to updateItemQuery()

    const i = itemIndex.value;
    const m = contentStore.findActiveManifestIndex(manifests.value, url);

    const query = (manifests.value && manifests.value.length > 0) ? {
      m,
      i,
    } : { i };
    await BookmarkService.updateQuery(query);
  };

  const getSupport = (support: Support[] | undefined) => {
    const configStore = useConfigStore();
    const { container } = configStore.config;

    support?.forEach((s) => {
      const hasElement = document.getElementById(s.url);
      if (s.type === 'font' && !hasElement) loadFont(s.url, container);
      if (s.type !== 'font' && !hasElement) loadCss(s.url);
    });
  };

  return {
    activeContentMap,
    collection,
    item,
    itemUrl,
    manifests,
    manifest,
    collectionTitle,
    itemIndex,
    setCollection,
    setItem,
    setItemUrl,
    setManifests,
    setManifest,
    setActiveContentMap,
    findActiveManifestIndex,
    findManifestIndexOfManifestInConfig,
    getManifest,
    isManifestPartInsideRangeValue,
    isItemPartInsideRangeValue,
    initCollection,
    initManifest,
    initItem,
    getSupport,
  };
});
