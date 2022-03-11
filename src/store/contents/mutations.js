export const setCollection = (state, payload) => {
  state.collection = payload;
};

export const setCollectionTitle = (state, title) => {
  state.collectionTitle = title;
};

export const setContentIndex = (state, payload) => {
  state.contentIndex = payload;
};

export const setContentIndexChange = (state, contentIndex) => {
  state.contentIndex = contentIndex;
};

export const setContentItem = (
  state,
  {
    item, errorText, contentUrls, contentTypes,
  },
) => {
  state.item = item;
  state.errorText = errorText;
  state.contentUrls = contentUrls;
  state.contentTypes = contentTypes;
};

export const updateExpanded = (state, payload) => {
  state.expanded = payload;
};

export const setImageData = (state, payload) => {
  state.image = { ...payload };
};

export const setIsCollection = (state, payload) => {
  state.isCollection = payload.isCollection;
};

export const setItemUrl = (state, url) => {
  state.itemUrl = url;
};

export const setItemUrls = (state, payload) => {
  state.itemUrls = payload.itemUrls;
};

export const setLoaded = (state, payload) => {
  state.loaded = payload.loaded;
};

export const setManifests = (state, payload) => {
  state.manifests = payload.manifests;
};

export const setPanels = (state, payload) => {
  state.panels = payload.panels;
};

export const setSequenceIndex = (state, payload) => {
  state.sequenceIndex = payload;
};

export const setTree = (state, payload) => {
  state.tree = payload.tree;
};

export const resetContents = (state) => {
  state.collection = {};
  state.collectionTitle = '';
  state.contentIndex = 0;
  state.contentTypes = [];
  state.contentUrls = [];
  state.errorText = null;
  state.expanded = [];
  state.image = {};
  state.isCollection = false;
  state.item = {};
  state.itemUrl = '';
  state.itemUrls = [];
  state.loaded = false;
  state.manifests = [];
  state.sequenceIndex = 0;
  state.panels = [];
  state.tree = [];
};
