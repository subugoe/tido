import { request } from '@/utils/http';
import * as AnnotationUtils from '@/utils';
import * as contentUtils from '@/utils/contents';

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

  commit('updateManifests', { manifests: [response.manifest] });
  commit('updateItemUrls', { itemUrls: response.itemUrls });
  commit('updateLoaded', { loaded: true });
  commit('updateTree', { tree: response.tree });
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
      this.$root.$emit('update-tree-knots', node.label);
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

    commit('updateManifests', { manifests });
    commit('updateItemUrls', { itemUrls });
    commit('updateLoaded', { loaded: true });
    commit('updateTree', { tree });
    commit('updateCollectionTitle', collectiontitle);
    commit('updateCollection', data);
  }
};

export const updateItemUrl = ({ commit }, url) => {
  commit('updateItemUrl', url);
};

export const initImageData = async ({ commit }, url) => {
  const data = await request(url);
  let imageUrl = '';
  let hasError = false;
  let errorImage = null;

  commit('updateImageData', {
    imageUrl,
    hasError,
    errorImage,
  });

  if (data.image) {
    imageUrl = data.image.id;
    try {
      const response = await fetch(imageUrl);
      if (response.status === 200 || response.status === 201) {
        hasError = false;
        errorImage = null;
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

  commit('updateImageData', {
    imageUrl,
    hasError,
    errorImage,
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
    commit, getters, dispatch, rootState,
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

    [contentUrls, contentTypes] = getContentUrls(data.content);

    const currentManifest = contentUrls[0]
      .split('/')
      .pop()
      .split('-')[0];

    if (previousManifest !== currentManifest) {
      const tabs = AnnotationUtils.getAnnotationTabs(config);
      dispatch('annotations/updateActiveTab', tabs?.[0].key, {
        root: true,
      });
      isManifestChanged = true;
    }

    if (data.annotationCollection) {
      dispatch('annotations/initAnnotations', data.annotationCollection, {
        root: true,
      });
    }
  } catch (err) {
    errorText = {
      messageKey: 'textErrorMessageNotExists',
    };
  }

  commit('updateContentItem', {
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

export const removeFromExpanded = ({ commit, getters }, label) => {
  const expanded = [...getters.expanded];
  const index = expanded.indexOf(label);
  expanded.splice(index, 1);
  commit('updateExpanded', [...expanded]);
};

export const addOrRemoveFromExpanded = ({ getters, dispatch }, label) => {
  const expanded = [...getters.expanded];
  if (expanded.includes(label)) {
    dispatch('removeFromExpanded', label);
  } else {
    dispatch('addToExpanded', label);
  }
};