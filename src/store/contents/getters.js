export const collection = (state) => state.collection;

export const collectionTitle = (state) => state.collectionTitle;

export const connectorValues = (state) => state.connectorValues;

export const contentIndex = (state) => state.contentIndex;

export const contentTypes = (state) => state.contentTypes;

export const contentUrls = (state) => state.contentUrls;

export const errorImage = (state) => state.image.errorImage;

export const errorText = (state) => state.errorText;

export const expanded = (state) => state.expanded;

export const isCollection = (state) => state.isCollection;

export const loadingImage = (state) => state.image.loadingImage;

export const imageHasError = (state) => state.image.hasError;

export const imageInit = (state) => state.image.init;

export const imageUrl = (state) => state.image.imageUrl;

export const itemUrl = (state) => state.itemUrl;

export const itemUrls = (state) => state.itemUrls;

export const loaded = (state) => state.loaded;

export const manifests = (state) => state.manifests;

export const panels = (state) => state.panels;

export const sequenceIndex = (state) => state.sequenceIndex;

export const selectedItemIndex = (state) => {
  const nodelabel = state.itemUrl;
  let idx = 0;
  state.itemUrls.forEach((item, index) => {
    if (item === nodelabel) {
      idx = index;
    }
  });
  return idx;
};

export const selectedManifest = (state) => state.manifests.find((manifest) => manifest.sequence.find((manifestItem) => manifestItem.id === state.itemUrl));

export const selectedSequenceIndex = (state, getters) => {
  const item = getters.selectedManifest;
  if (!item) {
    return null;
  }

  const { label } = item;
  let index = null;
  state.manifests.forEach((manifest, idx) => {
    if (manifest.label === label) {
      index = idx;
    }
  });
  return index;
};

export const item = (state) => state.item;

export const tree = (state) => state.tree;
