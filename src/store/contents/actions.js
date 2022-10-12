import { request } from '@/utils/http';
import * as PanelsUtils from '@/utils/panels';
import BookmarkService from '@/services/bookmark';

/**
 * extract the 'label part' of the itemurl
 * caller: *getItemUrls()*
 *
 * @param string itemurl
 *
 * @return string 'label part'
 */
function getItemLabel(itemurl) {
  return itemurl.replace(/.*-(.*)\/latest.*$/, '$1');
}

/**
 * get all itemurls hosted by each manifest's sequence to populate the aprropriate tree node
 * caller: *getManifest()*
 *
 * @param array sequence
 * @param string label
 *
 * @return array urls
 */
function getItemUrls(sequence) {
  console.log('getItemUrls');
  const urls = [];

  sequence.forEach((item) => {
    const itemLabel = getItemLabel(item.id);

    urls.push({
      label: item.id,
      'label-key': `${itemLabel}`,
      labelSheet: true,
    });
  });
  return urls;
}

function findActiveManifestIndex(manifests = [], itemUrl = null) {
  if (manifests.length === 0) return -1;
  if (!itemUrl) return 0;

  itemUrl = encodeURI(decodeURI(itemUrl));

  return manifests.findIndex(({ sequence }) => {
    sequence = Array.isArray(sequence) ? sequence : [sequence];
    return sequence.find(({ id }) => encodeURI(decodeURI(id)) === itemUrl);
  });
}

// export const findSelectedManifestIndex = (manifest, getters) => {
//   const { label } = manifest;
//   let index = null;
//   manifests.forEach((manifest, idx) => {
//     if (manifest.label === label) {
//       index = idx;
//     }
//   });
//   return index;
// };

async function getManifest(url) {
  console.log('getManifest');

  const data = await request(url);

  // if (!Array.isArray(data.sequence)) {
  //   data.sequence = [data.sequence];
  // }

  // if (data.sequence[0] !== 'undefined') {
  //   data.sequence.map((seq) => itemUrls.push(seq.id));
  // }

  // const tree = [];
  // if (isCollection) {
  //   tree.push({
  //     children: getItemUrls(data.sequence, data.label),
  //     label: data.label,
  //     'label-key': data.label,
  //     handler: (node) => {
  //       dispatch('addOrRemoveFromExpanded', node.label);
  //     },
  //     selectable: false,
  //   });
  // } else {
  //   tree.push(...getItemUrls(data.sequence, data.label));
  // }

  return data;
}

async function getItem(url) {
  const data = await request(url);
  return data;
}

export const initCollection = async ({ commit, dispatch, getters, rootGetters }, url) => {
  console.log('initCollection');

  const { item } = getters;
  let { item: itemUrl } = rootGetters['config/config'];

  // commit('resetContents');

  const collection = await request(url);

  // const collectiontitle = contentUtils.getLabel(data);
  //
  // tree.push({
  //   children: [],
  //   handler: (node) => {
  //     dispatch('addOrRemoveFromExpanded', node.label);
  //   },
  //   label: collectiontitle,
  //   'label-key': collectiontitle,
  //   selectable: false,
  // });


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

      if (!itemUrl && Array.isArray(activeManifest.sequence) && activeManifest.sequence.length > 0) {
        itemUrl = activeManifest.sequence[0].id;
      }

      console.log('initItem at initCollection');
      if (!item) dispatch('initItem', itemUrl);
    }



    // const promises = [];
    // data.sequence.forEach((seq) => promises.push(getManifest(seq.id, true, dispatch)));
    //
    // const results = await Promise.all(promises);
    // results.forEach((el) => {
    //   tree[0].children.push(...el.tree);
    //   manifests.push(el.manifest);
    //   itemUrls.push(...el.itemUrls);
    // });
    //
    // commit('setManifests', { manifests });
    // commit('setItemUrls', { itemUrls });
    // commit('setLoaded', { loaded: true });
    // commit('setTree', { tree });
  }
};

export const setActiveManifest = ({ commit }, manifest) => {

};

export const initManifest = async ({ commit, dispatch, getters, rootGetters }, url) => {
  console.log('initManifest');
  // commit('resetContents');

  const { item, manifests } = getters;
  const config = rootGetters['config/config'];
  // const activeViews = rootGetters['config/activeViews'];

  let manifest;
  if (manifests) {
    manifest = manifests.find(({ id }) => id === url)
  } else {
    manifest = await getManifest(url);
  }

  commit('setManifest', manifest);

  // We know here that no item was loaded. Neither from URL nor from user config.
  // So we load the first manifest item.
  if (!item && Array.isArray(manifest.sequence) && manifest.sequence.length > 0) {
    console.log('initItem at initManifest');
    dispatch('initItem', manifest.sequence[0].id);
  }
};

export const initItem = async ({ commit, dispatch }, url) => {
  console.log('initItem');
  const item = await getItem(url);
  commit('setItem', item);
  commit('setItemUrl', url);

  if (item.annotationCollection) {
    dispatch('annotations/initAnnotations', item.annotationCollection, { root: true});
  }

  await BookmarkService.updateItemQuery(url);
};

export const updateImageLoading = async ({ commit }, payload) => {
  commit('setImageLoaded', payload);
};

export const initAnnotations = async ({ commit, rootG }, url) => {
  const annotations = await request(url);
  commit('setAnnotations', annotations);
};
