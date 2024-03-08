import { request } from '@/utils/http';
import BookmarkService from '@/services/bookmark';
import { loadCss, loadFont } from '../../utils';

export const getItemIndex = async ({ getters }, itemUrl) => {
  const { manifest } = getters;
  const items = manifest.sequence;
  const itemIndex = items.findIndex((item) => item.id === itemUrl);
  return itemIndex;
};

export const getPanels = async ({ getters }) => getters.panels;

export const getShow = async ({ getters }) => getters.show;

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
  const resultConfig = rootGetters['config/config'];
  let { item: itemUrl } = rootGetters['config/config'];
  let collection = '';
  try {
    collection = await request(url);
  } catch (err) {
    console.log(err.message);
  }
  commit('setCollection', collection);
  let activeManifest = '';
  let manifestIndex;
  let itemIndex;

  console.log('Result config', resultConfig);

  if (Array.isArray(collection.sequence) && collection.sequence.length > 0) {
    const promises = [];
    collection.sequence.forEach((seq) => promises.push(getManifest(seq.id)));
    const manifests = await Promise.all(promises);
    commit('setManifests', manifests);

    // Check if manifestIndex or item Index are part of the result config
    if ('m' in resultConfig && 'i' in resultConfig) {
      const manifestIndexInConfig = resultConfig.m;
      const itemIndexInConfig = resultConfig.i;
      manifestIndex = Number(manifestIndexInConfig) > 0 ? Number(manifestIndexInConfig) : 0;
      itemIndex = Number(itemIndexInConfig) > 0 ? Number(itemIndexInConfig) : 0;
    } else {
      [manifestIndex, itemIndex] = [0, 0];
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
  commit, dispatch, getters, rootGetters,
}, url) => {
  const { item } = getters;

  const resultConfig = rootGetters['config/config'];
  let itemIndex;

  // Check if manifestIndex or item Index are part of the result config
  if ('i' in resultConfig) {
    const itemIndexInConfig = resultConfig.i;
    itemIndex = (Number.isInteger(itemIndexInConfig) && itemIndexInConfig > 0) ? itemIndexInConfig : 0;
  } else {
    itemIndex = 0;
  }
  const manifest = await getManifest(url);
  commit('setManifest', manifest);

  const { support } = manifest;
  if (support && support.length > 0) {
    await dispatch('getSupport', support);
  }

  // We know here that no item was loaded. Neither from URL nor from user config.
  // So we load the first manifest item.
  if (!item && Array.isArray(manifest.sequence) && manifest.sequence.length > 0) {
    const itemUrl = manifest.sequence[itemIndex].id;
    dispatch('initItem', itemUrl);
  }
};

export const initItem = async ({ commit, dispatch, getters }, url) => {
  const item = await getItem(url); // To fix: what about if this load fails, e.g content not anymore in this url -> maybe try and catch ?
  commit('setItem', item);
  commit('setItemUrl', url);

  if (item.annotationCollection) {
    await dispatch('annotations/initAnnotations', item.annotationCollection, { root: true });
  }
  const manifests = getters.manifests ? getters.manifests : [];
  // here we have item query -> we should extract the manifest index and the item index from the query and then give it as a parameter to updateItemQuery()
  const i = await dispatch('getItemIndex', url);
  const m = findActiveManifestIndex(manifests, url);
  // const p = await dispatch('getPanels');
  const s = await dispatch('getShow');

  // If in the URL it is given which panels to show initially, then show only those
  if (s !== null) {
    if (s.length > 0) {
      const totalShowPanels = Array.from({ length: 4 }, (value, index) => index);

      const closedPanels = totalShowPanels.filter((element) => !s.includes(element));
      const show = false;
      if (closedPanels.length > 0) {
        closedPanels.forEach((index) => {
          const input = { index, show };
          dispatch('config/setShowPanel', input, { root: true });
        });
      }
    }
  }
 
  const query = manifests.length > 0 ? {
    m,
    i,
  } : { i };
  console.log('query', query);
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
