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

async function getAnnotations(url) {
  const data = await request(url);
  return data;
}

export const initPanels = ({ dispatch, rootGetters }) => {
  console.log('initPanels');
  const config = rootGetters['config/config'];
  let panels = [];

  panels = PanelsUtils.preparePanels(config);
  panels = PanelsUtils.setupPanels(panels);

  dispatch('setPanels', panels);
};

export const initCollection = async ({ commit, dispatch, rootGetters }, url) => {
  console.log('initCollection');
  const tree = [];
  const manifests = [];
  const itemUrls = [];

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
    console.log(activeManifestIndex);

    if (activeManifestIndex > -1) {
      const activeManifest = manifests[activeManifestIndex];

      commit('setManifest', activeManifest);

      if (!itemUrl && Array.isArray(activeManifest.sequence) && activeManifest.sequence.length > 0) {
        itemUrl = activeManifest.sequence[0].id;
      }

      dispatch('initItem', itemUrl);
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

export const initManifest = async ({ commit, dispatch }, url) => {
  console.log('initManifest');
  // commit('resetContents');

  const manifest = await getManifest(url);

  commit('setManifest', manifest);

  // We know here that no item was loaded. Neither from URL nor from user config.
  // So we load the first manifest item.
  if (Array.isArray(manifest.sequence) && manifest.sequence.length > 0) {
    dispatch('initItem', manifest.sequence[0].id);
  }
};

export const initItem = async ({ commit, dispatch }, url) => {
  console.log('initItem');
  const item = await getItem(url);
  commit('setItem', item);

  if (item.annotationCollection) {
    dispatch('annotations/initAnnotations', item.annotationCollection, { root: true});
  }

  await BookmarkService.updateItemQuery(url);
};

export const setItemUrl = ({ commit, dispatch }, url) => {
  commit('setItemUrl', url);
  //  dispatch('initItem', url);
};

export const setContentIndex = ({ commit }, index) => {
  BookmarkService.updateTextQuery(index);

  commit('setContentIndex', index);
};

export const updateImageLoading = async ({ commit }, payload) => {
  commit('setImageLoaded', payload);
};

export const initAnnotations = async ({ commit, rootG }, url) => {
  const annotations = await request(url);
  commit('setAnnotations', annotations);
};

export const initImageData = async ({ commit }, url) => {
  const data = await request(url);
  let imageUrl = '';
  let hasError = false;
  let errorImage = null;
  console.log('initImageData');
  commit('setImageData', {
    imageUrl,
    hasError,
    errorImage,
    loadingImage: true,
    init: false,
  });

  if (data.image) {
    imageUrl = data.image.id;
    try {
      const response = await fetch(imageUrl);
      if (response.status === 200 || response.status === 201) {
        hasError = false;
        errorImage = null;
      } else if (response.status === 500) {
        hasError = true;
        errorImage = {
          messageKey: 'imageErrorMessageNotExists',
        };
      } else {
        // for vpn error.
        hasError = true;
        errorImage = {
          messageKey: 'imageErrorMessageVPN',
        };
      }
    } catch (err) {
      // for CORS error.
      hasError = true;
      errorImage = {
        messageKey: 'imageErrorMessageVPN',
      };
    }
  } else {
    hasError = true;
    errorImage = {
      messageKey: 'imageErrorMessageNotExists',
    };
  }

  commit('setImageData', {
    imageUrl,
    hasError,
    errorImage,
    init: true,
    loadingImage: !errorImage,
  });
};

/**
 * filter all urls that match either of the MIME types "application/xhtml+xml" and "text/html"
 * caller: *getItemData()*
 *
 * @param string array
 *
 * @return array
 */
function getContentUrls(content, config) {
  console.log('getContentUrls');

  const contentTypes = [];

  if (Array.isArray(content) && content.length) {
    content.forEach((c) => {
      if (c.type.match(/(application\/xhtml\+xml|text\/html)/)) {
        contentTypes.push({
          label: c.type.split('type=')[1],
          priority:
            config?.textContent?.tabs.priority?.[c.type.split('type=')[1]]
            || 100,
          url: c.url,
        });
      }
    });
    contentTypes.sort((a, b) => a.priority - b.priority);
  }
  return [contentTypes.map((x) => x.url), contentTypes.map((x) => x.label)];
}

export const initContentItem = async ({ commit, getters, rootState }, url) => {
  let isManifestChanged = false;
  let item = {};
  let errorText = null;
  let { contentUrls } = getters;
  let contentTypes = [];
  const { config } = rootState.config;
  console.log('initContentItem');

  try {
    const data = await request(url);

    item = data;

    const previousManifest = (contentUrls[0] || '')
      .split('/')
      .pop()
      .split('-')[0];

    [contentUrls, contentTypes] = getContentUrls(data.content, config);

    const currentManifest = contentUrls[0]
      .split('/')
      .pop()
      .split('-')[0];

    if (!previousManifest) {
      BookmarkService.setContentTabFromQuery();
      BookmarkService.setAnnotationTabFromQuery();
    } else if (previousManifest !== currentManifest) {
      isManifestChanged = true;
      BookmarkService.setDefaultContentAndAnnotationTabs();
      BookmarkService.setDefaultContentAndAnnotationQuery();
    }
  } catch (err) {
    errorText = {
      messageKey: 'textErrorMessageNotExists',
    };
  }

  commit('setContentItem', {
    item,
    errorText,
    contentUrls,
    contentTypes,
  });

  return { isManifestChanged };
};

export const addToExpanded = ({ commit, getters }, label) => {
  const expanded = [...getters.expanded];
  console.log('addToExpanded');

  expanded.push(label);
  commit('updateExpanded', [...expanded]);
};

export const updateExpanded = ({ commit }, payload) => {
  commit('updateExpanded', [...payload]);
};

export const removeFromExpanded = ({ commit, getters }, label) => {
  const expanded = [...getters.expanded];
  const index = expanded.indexOf(label);

  if (index > -1) {
    expanded.splice(index, 1);
    commit('updateExpanded', [...expanded]);
  }
};

export const addOrRemoveFromExpanded = ({ getters, dispatch }, label) => {
  const expanded = [...getters.expanded];

  if (expanded.includes(label)) {
    dispatch('removeFromExpanded', label);
  } else {
    dispatch('addToExpanded', label);
  }
};

export const setConnectors = ({ commit }, connectors) => {
  commit('setConnectorValues', connectors);
};

export const setConnectorValues = ({ commit, getters }, { panelIndex, value }) => {
  const connectorValues = [...getters.connectorValues];
  BookmarkService.updateConnectorQuery(value, panelIndex);

  connectorValues[panelIndex] = value;
  commit('setConnectorValues', connectorValues);
};

export const setPanels = ({ commit }, payload) => {
  const isPanelsArray = Array.isArray(payload);
  console.log('setPanels');
  if (isPanelsArray) {
    commit('setPanels', payload);
  } else {
    BookmarkService.updatePanelsQuery(payload.panels);
  }
};

export const updateContentDOM = () => null;
