import { request } from '@/utils/http';
import * as contentUtils from '@/utils/contents';
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

/**
 * get all the data provided on 'manifest level'
 * caller: *init()*, *getCollection()*
 *
 * @param string url
 */
async function getManifest(url, isCollection, dispatch) {
  const itemUrls = [];
  const data = await request(url);

  if (!Array.isArray(data.sequence)) {
    data.sequence = [data.sequence];
  }

  if (data.sequence[0] !== 'undefined') {
    data.sequence.map((seq) => itemUrls.push(seq.id));
  }

  const tree = [];
  if (isCollection) {
    tree.push({
      children: getItemUrls(data.sequence, data.label),
      label: data.label,
      'label-key': data.label,
      handler: (node) => {
        dispatch('addOrRemoveFromExpanded', node.label);
      },
      selectable: false,
    });
  } else {
    tree.push(...getItemUrls(data.sequence, data.label));
  }

  return {
    manifest: data,
    tree,
    itemUrls,
  };
}

export const initManifest = async ({ commit, dispatch }, url) => {
  commit('resetContents');

  const response = await getManifest(url, false, dispatch);

  commit('setManifests', { manifests: [response.manifest] });
  commit('setItemUrls', { itemUrls: response.itemUrls });
  commit('setLoaded', { loaded: true });
  commit('setTree', { tree: response.tree });
};

export const initPanels = ({ dispatch, rootGetters }) => {
  const isConfigValid = rootGetters['config/isConfigValid'];

  if (!isConfigValid) {
    return;
  }

  const config = rootGetters['config/config'];
  let panels = [];

  panels = PanelsUtils.preparePanels(config);
  panels = PanelsUtils.setupPanels(panels);

  dispatch('setPanels', panels);
};

export const initCollection = async ({ commit, dispatch }, url) => {
  const tree = [];
  const manifests = [];
  const itemUrls = [];

  commit('resetContents');

  const data = await request(url);
  const collectiontitle = contentUtils.getLabel(data);

  tree.push({
    children: [],
    handler: (node) => {
      dispatch('addOrRemoveFromExpanded', node.label);
    },
    label: collectiontitle,
    'label-key': collectiontitle,
    selectable: false,
  });

  if (Array.isArray(data.sequence)) {
    const promises = [];
    data.sequence.forEach((seq) => promises.push(getManifest(seq.id, true, dispatch)));

    const results = await Promise.all(promises);
    results.forEach((el) => {
      tree[0].children.push(...el.tree);
      manifests.push(el.manifest);
      itemUrls.push(...el.itemUrls);
    });

    commit('setManifests', { manifests });
    commit('setItemUrls', { itemUrls });
    commit('setLoaded', { loaded: true });
    commit('setTree', { tree });
    commit('setCollectionTitle', collectiontitle);
    commit('setCollection', data);
  }
};

export const setItemUrl = ({ commit }, url) => {
  commit('setItemUrl', url);
};

export const setContentIndex = ({ commit }, index) => {
  BookmarkService.updateTextQuery(index);

  commit('setContentIndex', index);
};

export const updateImageLoading = async ({ commit }, payload) => {
  commit('setImageLoaded', payload);
};

export const initImageData = async ({ commit }, url) => {
  const data = await request(url);
  let imageUrl = '';
  let hasError = false;
  let errorImage = null;

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

export const initContentItem = async (
  {
    commit, getters, rootState,
  },
  url,
) => {
  let isManifestChanged = false;
  let item = {};
  let errorText = null;
  let { contentUrls } = getters;
  let contentTypes = [];
  const { config } = rootState.config;

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

    if (previousManifest !== currentManifest) {
      isManifestChanged = true;
    }

    const index = BookmarkService.handleContentItemDataChange(isManifestChanged, previousManifest);

    commit('setContentIndex', index);
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
  commit('setConnectorValue', connectors);
};

export const setConnectorValues = ({ commit, getters }, { index, value, updateQuery }) => {
  const connectorValues = [...getters.connectorValues];

  BookmarkService.getConnectorValue(index);

  if (updateQuery) {
    BookmarkService.updateConnectorQuery(value, index);
  }

  connectorValues[index] = value;
  commit('setConnectorValue', connectorValues);
};

export const setPanels = ({ commit }, payload) => {
  const isPanelsArray = Array.isArray(payload);

  if (isPanelsArray) {
    commit('setPanels', payload);
  } else {
    BookmarkService.updatePanelsQuery(payload.panels);
  }
};

export const updateContentDOM = () => null;
