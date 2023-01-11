const components = {
  1: {
    component: 'Tree',
    label: 'content',
  },
  2: {
    component: 'Metadata',
    label: 'metadata',
  },
  3: {
    component: 'OpenSeadragon',
    label: 'image',
  },
  4: {
    component: 'Content',
    label: 'text',
  },
  5: {
    component: 'Annotations',
    label: 'annotations',
  },
};

export const findComponent = (id) => ({
  id,
  ...components[id],
});
