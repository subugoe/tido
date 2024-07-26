const components = {
  1: {
    component: 'TreeView',
    label: 'content',
  },
  2: {
    component: 'MetadataView',
    label: 'metadata',
  },
  3: {
    component: 'ImageView',
    label: 'image',
  },
  4: {
    component: 'ContentView',
    label: 'text',
  },
  5: {
    component: 'AnnotationsView',
    label: 'annotations',
  }
};

export const findComponent = (id) => ({
  id,
  ...components[id],
});
