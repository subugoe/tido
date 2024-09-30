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


export function getFontSizes(view, defaultFonts) {
  const options = view.connector.options
  const fontSize = options.default_font_size? options.default_font_size: null
  const minSize = options.min_font_size? options.min_font_size: null
  const maxSize = options.max_font_size? options.max_font_size: null

  return {...defaultFonts, ...(fontSize && {fontSize}), ...(minSize && {minSize}), ...(maxSize && {maxSize})}
}