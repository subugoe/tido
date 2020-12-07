/*
  Configuration options
  =====================
  src/statics/config.js

  Please refer to our README for detailed instructions!
*/
import { v4 as uuidv4 } from 'uuid';

const conf = {
  entrypoint: 'https://ahikar-test.sub.uni-goettingen.de/api/textapi/ahikar/3r9ps/collection.json',
  colors: {
    primary: '',
    secondary: '',
    accent: '',
  },
  headers: {
    all: true,
    info: true,
    navigation: true,
    panels: true,
    toggle: true,
  },
  labels: {
    item: 'Sheet',
    manifest: 'Manuscript',
  },
  meta: {
    collection: {
      all: true,
      collector: true,
      description: true,
      title: true,
    },
    manifest: {
      all: true,
      creation: true,
      editor: true,
      label: true,
      location: true,
      origin: true,
    },
    item: {
      all: true,
      label: true,
      language: true,
    },
  },
  standalone: true,
};

// -- Configuration for the panels --

// each "connector" requires at least one "component id" to get the appropriate panel rendered;
// providing more than one id turns the panels into tabs.

// -- Component IDs for reference --

// - 1 = Treeview
// - 2 = Metadata
// - 3 = OpenSeadragon
// - 4 = Content / Text
// - 5 = Annotations

const panels = [
  {
    id: uuidv4(),
    connector: [1],
    panel_label: 'Tabs',
    show: true,
  },
  {
    id: uuidv4(),
    connector: [4, 5],
    panel_label: 'Text',
    show: true,
  },
  {
    id: uuidv4(),
    connector: [3],
    panel_label: 'Image',
    show: true,
  },
  {
    id: uuidv4(),
    connector: [2],
    panel_label: 'Metadata',
    show: true,
  },
];

export { conf, panels };
