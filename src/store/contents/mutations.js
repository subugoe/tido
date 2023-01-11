export const setCollection = (state, payload) => {
  state.collection = { ...payload };
};

export const setCollectionTitle = (state, title) => {
  state.collectionTitle = title;
};

export const setConnectorValues = (state, payload) => {
  state.connectorValues = payload;
};

export const setItem = (state, payload) => {
  state.item = payload;
};

export const setItemUrl = (state, url) => {
  state.itemUrl = url;
};

export const setManifests = (state, payload) => {
  state.manifests = payload;
};

export const setPanels = (state, payload) => {
  state.panels = payload;
};

export const setManifest = (state, payload) => {
  if (!Array.isArray(payload.sequence)) payload.sequence = [payload.sequence];
  state.manifest = { ...payload };
};

export const setActiveContentUrl = (state, payload) => {
  state.activeContentUrl = payload;
};
