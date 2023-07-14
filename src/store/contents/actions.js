import { request } from '@/utils/http';
import BookmarkService from '@/services/bookmark';
import { loadCss, loadFont } from '../../utils';

function findActiveManifestIndex(manifests = [], itemUrl = null) {
  if (manifests.length === 0) return -1;
  if (!itemUrl) return 0;

  itemUrl = encodeURI(decodeURI(itemUrl));

  return manifests.findIndex(({ sequence }) => {
    sequence = Array.isArray(sequence) ? sequence : [sequence];
    return sequence.find(({ id }) => encodeURI(decodeURI(id)) === itemUrl);
  });
}

async function getManifest(url) {
  const data = await request(url);
  return data;
}

async function getItem(url) {
  const data = await request(url);
  return data;
}

export const initCollection = async ({
  commit, dispatch, getters, rootGetters,
}, url) => {
  const { item } = getters;
  let { item: itemUrl } = rootGetters['config/config'];

  const collection = await request(url);

  commit('setCollection', collection);

  // We know here that no manifest was loaded. Neither from URL nor from user config.
  // So we load the first collection item.
  if (Array.isArray(collection.sequence) && collection.sequence.length > 0) {
    const promises = [];
    collection.sequence.forEach((seq) => promises.push(getManifest(seq.id)));

    const manifests = await Promise.all(promises);
    commit('setManifests', manifests);

    const activeManifestIndex = findActiveManifestIndex(manifests, itemUrl);

    if (activeManifestIndex > -1) {
      const activeManifest = manifests[activeManifestIndex];
      commit('setManifest', activeManifest);

      const { support } = activeManifest;

      if (support && support.length > 0) {
        await dispatch('getSupport', support);
      }

      if (!itemUrl && Array.isArray(activeManifest.sequence) && activeManifest.sequence.length > 0) {
        itemUrl = activeManifest.sequence[0].id;
      }

      if (!item) dispatch('initItem', itemUrl);
    }
  }
};

export const initManifest = async ({ commit, dispatch, getters }, url) => {
  const { item, manifests } = getters;

  let manifest;
  if (manifests) {
    manifest = manifests.find(({ id }) => id === url);
  } else {
    manifest = await getManifest(url);
  }

  commit('setManifest', manifest);

  const { support } = manifest;

  if (support && support.length > 0) {
    await dispatch('getSupport', support);
  }

  // We know here that no item was loaded. Neither from URL nor from user config.
  // So we load the first manifest item.
  if (!item && Array.isArray(manifest.sequence) && manifest.sequence.length > 0) {
    dispatch('initItem', manifest.sequence[0].id);
  }
};

export const initItem = async ({ commit, dispatch }, url) => {
  const item = await getItem(url);
  commit('setItem', item);
  commit('setItemUrl', url);

  if (item.annotationCollection) {
    await dispatch('annotations/initAnnotations', item.annotationCollection, { root: true });
  }

  await BookmarkService.updateItemQuery(url);
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
