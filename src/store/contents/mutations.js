export const updateCollection = (state, update) => {
  state.collection = update;
};

export const updateCollectionTitle = (state, title) => {
  state.collectionTitle = title;
};

export const updateContentItem = (
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

export const updateIsCollection = (state, update) => {
  state.isCollection = update.isCollection;
};

export const updateItemUrl = (state, url) => {
  state.itemUrl = url;
};

export const updateItemUrls = (state, update) => {
  state.itemUrls = update.itemUrls;
};

export const updateLoaded = (state, update) => {
  state.loaded = update.loaded;
};

export const updateManifests = (state, update) => {
  state.manifests = update.manifests;
};

export const updateImageData = (state, update) => {
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

export const updateTree = (state, update) => {
  state.tree = update.tree;
};

export const updateExpanded = (state, update) => {
  state.expanded = update;
};
