export const collection = (state) => state.collection;

export const collectionTitle = (state) => {
  // eslint-disable-next-line no-shadow
  const { collection } = state;

  if (!collection) return null;

  if (Object.keys(collection).length) {
    return collection.title && collection.title[0].title
      ? collection.title[0].title
      : collection.label;
  }

  return collection.label
    ? collection.label
    : 'Manifest <small>(No label available)</small>';
};

export const itemUrl = (state) => state.itemUrl;

export const manifests = (state) => state.manifests;

export const selectedItemIndex = (state) => {
  const selectedItemUrl = encodeURI(decodeURI(state.itemUrl));
  const index = state.itemUrls.findIndex((item) => encodeURI(decodeURI(item)) === selectedItemUrl);
  return index > -1 ? index : 0;
};

export const selectedManifest = (state) => state.manifests.find((manifest) => {
  manifest = { ...manifest };
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

export const manifest = (state) => state.manifest;

export const activeContentUrl = (state) => state.activeContentUrl;
