import { request } from '@/utils/http';
import { i18n } from '@/i18n';
import BookmarkService from '@/services/bookmark';
import { loadCss, loadFont } from '../../utils';

export const getItemIndex = async ({ getters }, itemUrl) => {
  const { manifest } = getters;
  if (!manifest) return -1;
  return manifest.sequence.findIndex((item) => item.id === itemUrl);
};

function findActiveManifestIndex(manifests = [], itemUrl = null) {
  if (manifests.length === 0) return -1;
  if (!itemUrl) return 0;

  itemUrl = encodeURI(decodeURI(itemUrl));

  return manifests.findIndex(({ sequence }) => {
    sequence = Array.isArray(sequence) ? sequence : [sequence];
    return sequence.find(({ id }) => encodeURI(decodeURI(id)) === itemUrl);
  });
}

function findManifestIndexOfManifestInConfig(manifests, resultConfig) {
  // Url of manifest is given in resultConfig as 'manifest'
  const manifestUrl = resultConfig.manifest;
  return manifests.findIndex((element) => element.id === manifestUrl);
}

async function getManifest(url) {
  const data = await request(url);
  return data;
}

function isManifestPartInsideRangeValue(m, numberManifests) {
  return (m >= 0 && m < numberManifests);
}

function isItemPartInsideRangeValue(i, numberItems) {
  const itemAsInt = parseInt(i, 10);
  return (itemAsInt >= 0 && itemAsInt < numberItems);
}

export const initCollection = async ({
  commit, dispatch, getters, rootGetters,
}, url) => {
  const { item } = getters;
  const resultConfig = rootGetters['config/config'];
  let { item: itemUrl } = rootGetters['config/config'];
  let collection = '';
  let activeManifest = '';
  let manifestIndex;
  let itemIndex;

  try {
    collection = await request(url);
  } catch (err) {
    throw new Error(i18n.global.t('error_collection_url'));
  }
  commit('setCollection', collection);

  const numberManifests = Object.keys(collection).length > 0 ? collection.sequence.length : 0;

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
    const manifests = await Promise.all(promises);
    commit('setManifests', manifests);

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
        manifestIndex = findManifestIndexOfManifestInConfig(manifests, resultConfig);
      } else {
        manifestIndex = 0;
      }
    } else if ('manifest' in resultConfig && resultConfig.manifest !== '') {
      manifestIndex = findManifestIndexOfManifestInConfig(manifests, resultConfig);
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
    if ('p' in resultConfig) commit('setPanels', resultConfig.p);
    if ('s' in resultConfig) commit('setShow', resultConfig.s);
    const { support } = activeManifest;

    if (support && support.length > 0) {
      await dispatch('getSupport', support);
    }
    commit('setManifest', activeManifest);

    if (!item) dispatch('initItem', itemUrl);
  }
};

export const initManifest = async ({
  commit, dispatch, rootGetters,
}, url) => {
  let manifest = '';
  try {
    manifest = await request(url);
  } catch (err) {
    throw new Error(i18n.global.t('error_manifest_url'));
  }
  if (Array.isArray(manifest.sequence) && manifest.sequence.length <= 0) {
    throw new Error(i18n.global.t('error_no_items_in_manifest'));
  }

  const numberItems = manifest.sequence.length;
  commit('setManifest', manifest);
  const resultConfig = rootGetters['config/config'];
  const { item } = resultConfig;
  let itemIndex;

  if ('collection' in resultConfig && resultConfig.collection === '') {
    // we make sure that this error doesn't occur when switching manifest (the condition 'm' & 'i' in resultConfig)
    if (('m' in resultConfig && 'i' in resultConfig) || 'm' in resultConfig) {
      throw new Error(i18n.global.t('error_m_in_url_no_collection'));
    }
  }
  if ('i' in resultConfig && 'm' in resultConfig === false) {
    // when the we switch to an item in a new manifest
    itemIndex = resultConfig.i;
  } else if (item !== '') {
    // find the item index in this manifest
    itemIndex = manifest.sequence.findIndex((element) => element.id === item);
    if (itemIndex === -1) {
      // if the item is not found, then show errors
      throw new Error(i18n.global.t('error_item_not_in_manifest'));
    }
  } else if (resultConfig.manifest !== '') {
    itemIndex = 0;
  }

  const { support } = manifest;
  if (support && support.length > 0) {
    await dispatch('getSupport', support);
  }

  if (itemIndex !== undefined) {
    if (!isItemPartInsideRangeValue(itemIndex, numberItems)) {
      throw new Error(`Please enter 'i' as integer in this range [0,${numberItems})`);
    }
    const itemUrl = manifest.sequence[itemIndex].id;
    dispatch('initItem', itemUrl);
  }
};

export const initItem = async ({ commit, dispatch, getters }, url) => {
  let item = '';

  try {
    item = await request(url);
  } catch (err) {
    throw new Error(i18n.global.t('error_item_url'));
  }
  commit('setItem', item);
  commit('setItemUrl', url);

  if (item.annotationCollection) {
    await dispatch('annotations/initAnnotations', item.annotationCollection, { root: true });
  }
  const manifests = getters.manifests ? getters.manifests : [];
  // here we have item query -> we should extract the manifest index and the item index from the query and then give it as a parameter to updateItemQuery()

  const i = await dispatch('getItemIndex', url);
  const m = findActiveManifestIndex(manifests, url);

  const query = manifests.length > 0 ? {
    m,
    i,
  } : { i };
  await BookmarkService.updateQuery(query);
};

export const updateImageLoading = async ({ commit }, payload) => {
  commit('setImageLoaded', payload);
};

export const initAnnotations = async ({ commit }, url) => {
  const annotations = await request(url);
  commit('setAnnotations', annotations);
};

export const getSupport = ({ rootGetters }, support) => {
  const { container } = rootGetters['config/config'];

  support.forEach((s) => {
    const hasElement = document.getElementById(s.url);
    if (s.type === 'font' && !hasElement) loadFont(s.url, container);
    if (s.type !== 'font' && !hasElement) loadCss(s.url);
  });
};
