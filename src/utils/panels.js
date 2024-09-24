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
  },
};

export const findComponent = (id) => ({
  id,
  ...components[id],
});

const defaultFonts = {
  default_size: 16,
  min_size: 14,
  max_size: 28
}

export function getFontSizes(view) {
  
  if(!view.connector.options?.fonts) return defaultFonts
  const fonts = view.connector.options.fonts
  return {...defaultFonts, ...fonts}
}