import { request } from '@/utils/http';
import BookmarkService from '@/services/bookmark';
import { loadCss, loadFont } from '../../utils';

import { throwErrorObject } from '../../utils/error';

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
  const numberManifests = collection.sequence.length;
  if ('m' in resultConfig) {
    const m = resultConfig.m;
    // m doesn't fuilfill these conditions not part is integer and greater >= 0 and smaller than number of manifests
    if (m !== '') {
      if (numberManifests > 0) {
        if (Number.isInteger(m) && m >= 0 && m >= numberManifests) {
          const errorTitle = 'Range error';
          const errorMessage = `Please enter 'm' as integer in this range [0,${numberManifests})`;
          throwErrorObject(errorTitle, errorMessage);
        }
      }
    }
  }

  if (Array.isArray(collection.sequence) && collection.sequence.length > 0) {
    const promises = [];
    collection.sequence.forEach((seq) => promises.push(getManifest(seq.id)));
    const manifests = await Promise.all(promises);
    commit('setManifests', manifests);

    // Check if manifestIndex or item Index are part of the result config
    if ('m' in resultConfig && 'i' in resultConfig) {
      const manifestIndexInConfig = resultConfig.m;
      const itemIndexInConfig = resultConfig.i;
      manifestIndex = (Number.isInteger(manifestIndexInConfig) && manifestIndexInConfig > 0) ? manifestIndexInConfig : 0;
      itemIndex = (Number.isInteger(itemIndexInConfig) && itemIndexInConfig > 0) ? itemIndexInConfig : 0;
    } else if ('m' in resultConfig) {
      const manifestIndexInConfig = resultConfig.m;
      manifestIndex = (Number.isInteger(manifestIndexInConfig) && manifestIndexInConfig > 0) ? manifestIndexInConfig : 0;
      itemIndex = 0;
    } else if ('i' in resultConfig) {
      const itemIndexInConfig = resultConfig.i;
      itemIndex = (Number.isInteger(itemIndexInConfig) && itemIndexInConfig >= 0) ? itemIndexInConfig : undefined;
      if ('manifest' in resultConfig) {
        // Find the manifest Index of this manifest in this collection
        if (resultConfig['manifest'] !== '') {
          const manifestUrl = resultConfig['manifest'];
          manifestIndex = manifests.findIndex((element) => element.id === manifestUrl);
        }
        else {
          manifestIndex = 0;
        }
      } else {
        manifestIndex = 0;
      }
    } else if ('manifest' in resultConfig) {
      if (resultConfig['manifest'] !== '') {
        const manifestUrl = resultConfig['manifest'];
        manifestIndex = manifests.findIndex((element) => element.id === manifestUrl);
        itemIndex = 0;
      }
    } else {
      [manifestIndex, itemIndex] = [0, 0];
    }

    const numberItems = manifests[manifestIndex].sequence.length;
    if (itemIndex === undefined || itemIndex >= numberItems) {
      const errorTitle = "Range error";
      const errorMessage = `Please enter 'i' as integer in this range [0,${numberItems})`;
      throwErrorObject(errorTitle, errorMessage);
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
  const manifest = await getManifest(url);
  commit('setManifest', manifest);

  console.log('init manifest', url);
  const resultConfig = rootGetters['config/config'];
  const { item } = resultConfig;
  console.log('Item in initManifest', item);
  let itemIndex;
  let errorBoolean = false;

  // Check if manifestIndex or item Index are part of the result config
  if ('m' in resultConfig && 'i' in resultConfig) {
    itemIndex = undefined;
    errorBoolean = true;
    const errorTitle = "Input error in URL";
    const errorMessage = `cannot accept 'm' in the URL, since no collection is given`;
    throwErrorObject(errorTitle, errorMessage);
  }
  if (errorBoolean === false) {
    if ('i' in resultConfig) {
      const itemIndexInConfig = resultConfig.i;
      itemIndex = (Number.isInteger(itemIndexInConfig) && itemIndexInConfig > 0) ? itemIndexInConfig : 0;
    } else if ('m' in resultConfig) {
      console.log("Error: Since there is no collection, we cannot find this manifest, please enter the index of item 'i'");
    } else if (item !== '') {
      // find the item index in this manifest, if the item is not found, then show errors
      if (Array.isArray(manifest.sequence) && manifest.sequence.length > 0) {
        itemIndex = manifest.sequence.findIndex((element) => element.id === item);
      }
    }
    else {
      itemIndex = 0;
    }
  }

  const { support } = manifest;
  if (support && support.length > 0) {
    await dispatch('getSupport', support);
  }

  console.log('item Index', itemIndex);
  // We know here that no item was loaded. Neither from URL nor from user config.
  // So we load the first manifest item.
  if (itemIndex !== undefined && Array.isArray(manifest.sequence) && manifest.sequence.length > 0) {
    const itemUrl = manifest.sequence[itemIndex].id;
    dispatch('initItem', itemUrl);
  }
};

export const initItem = async ({ commit, dispatch, getters, rootGetters }, url) => {
  const item = await getItem(url); // To fix: what about if this load fails, e.g content not anymore in this url -> maybe try and catch ?
  console.log(getters.panels);
  const resultConfig = rootGetters['config/config'];
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
  const numberPanels = resultConfig.panels.length;

  const s = 's' in resultConfig ? resultConfig.s : Array.from({ length: numberPanels }, (value, index) => index);
  console.log('resultConfig in initItem', resultConfig);
  // If in the URL it is given which panels to show initially, then show only those
  console.log('show', s);
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
  console.log('query in init Item', query);
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
