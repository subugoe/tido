export const collection = (state) => state.collection;

export const collectionTitle = (state) => {
  const { collection } = state;
  if (Object.keys(collection).length) {
    return collection.title && collection.title[0].title
      ? collection.title[0].title
      : collection.label;
  }

  return collection.label
    ? collection.label
    : 'Manifest <small>(No label available)</small>';
}

export const connectorValues = (state) => state.connectorValues;

export const contentIndex = (state) => state.contentIndex;

export const contentTypes = (state) => state.contentTypes;

export const contentUrls = (state) => state.item?.content ?? [];

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
  const selectedItemUrl = encodeURI(decodeURI(state.itemUrl));
  const index = state.itemUrls.findIndex((item) => encodeURI(decodeURI(item)) === selectedItemUrl);
  return index > -1 ? index : 0;
};

export const selectedManifest = (state) => state.manifests.find((manifest) => {
  manifest = { ...manifest};
  const selectedItemUrl = encodeURI(decodeURI(state.itemUrl));
  if (!Array.isArray(manifest.sequence)) {
    manifest.sequence = [manifest.sequence];
  }
  return manifest.sequence.find((manifestItem) => encodeURI(decodeURI(manifestItem.id)) === selectedItemUrl);
});

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

export const manifest = (state) => state.manifest;

export const contentItem = (state) => (type) => state.item.content.find(c => c.type.split('type=')[1] === type);
