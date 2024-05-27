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

export const item = (state) => state.item;

export const manifest = (state) => state.manifest;

export const activeContentUrl = (state) => state.activeContentUrl;
