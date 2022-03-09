export const setCollection = (state, update) => {
  state.collection = update;
};

export const setCollectionTitle = (state, title) => {
  state.collectionTitle = title;
};

export const setContentIndex = (state, update) => {
  state.contentIndex = update;
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

export const updateExpanded = (state, update) => {
  state.expanded = update;
};

export const setImageData = (state, update) => {
  state.image = { ...update };
};

export const setIsCollection = (state, update) => {
  state.isCollection = update.isCollection;
};

export const setItemUrl = (state, url) => {
  state.itemUrl = url;
};

export const setItemUrls = (state, update) => {
  state.itemUrls = update.itemUrls;
};

export const setLoaded = (state, update) => {
  state.loaded = update.loaded;
};

export const setManifests = (state, update) => {
  state.manifests = update.manifests;
};

export const setPanels = (state, update) => {
  state.panels = update.panels;
};

export const setSequenceIndex = (state, update) => {
  state.sequenceIndex = update;
};

export const setTree = (state, update) => {
  state.tree = update.tree;
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
