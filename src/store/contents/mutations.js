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

export const setImageData = (state, update) => {
  state.image = { ...update };
};

export const resetContents = (state) => {
  state.contentUrls = [];
  state.collectionTitle = '';
  state.image = {};
  state.isCollection = false;
  state.itemUrl = '';
  state.itemUrls = [];
  state.loaded = false;
  state.manifests = [];
  state.tree = [];
};

export const setTree = (state, update) => {
  state.tree = update.tree;
};
