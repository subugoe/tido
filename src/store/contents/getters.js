export const isCollection = (state) => state.isCollection;

export const itemUrls = (state) => state.itemUrls;

export const tree = (state) => state.tree;

export const manifests = (state) => state.manifests;

export const loaded = (state) => state.loaded;

export const collectionTitle = (state) => state.collectionTitle;

export const itemUrl = (state) => state.itemUrl;

export const selectedManifest = (state) => state.manifests.find((manifest) => manifest.sequence.find((manifestItem) => manifestItem.id === state.itemUrl));

export const expanded = (state) => state.expanded;

export const contentIndex = (state) => state.contentIndex;

export const selectedSequenceIndex = (state, getters) => {
  const item = getters.selectedManifest;
  if (!item) {
    return 0;
  }

  const { label } = item;
  let index = 0;
  state.manifests.forEach((manifest, idx) => {
    if (manifest.label === label) {
      index = idx;
    }
  });
  return index;
};

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

export const imageUrl = (state) => state.image.imageUrl;

export const imageHasError = (state) => state.image.hasError;

export const errorImage = (state) => state.image.errorImage;

export const contentUrls = (state) => state.contentUrls;

export const item = (state) => state.item;

export const errorText = (state) => state.errorText;

export const contentTypes = (state) => state.contentTypes;

export const collection = (state) => state.collection;
