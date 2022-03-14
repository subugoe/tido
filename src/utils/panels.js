import { v4 as uuidv4 } from 'uuid';

const components = {
  1: {
    component: 'Tree',
    label: 'Contents',
  },
  2: {
    component: 'Metadata',
    label: 'Metadata',
  },
  3: {
    component: 'OpenSeadragon',
    label: 'Image',
  },
  4: {
    component: 'Content',
    label: 'Text',
  },
  5: {
    component: 'Annotations',
    label: 'Annotations',
  },
};

export const findComponent = (id) => ({
  id,
  ...components[id],
});

// get the "panels part" from the json object defined in src/index.template.html
// each panel needs a unique ID to distinguish it from one another (dynamic components)
// since it's not a config option, the IDs are pushed after reading the related panel config options
export const preparePanels = (config) => config.panels.map((el) => ({ ...el, id: uuidv4() }));

export const setupPanels = (panels) => {
  // will change all ids => component
  panels = panels.map((item) => {
    const newConnectors = item.connector.map((c) => (typeof c === 'number' ? findComponent(c) : c));
    return {
      ...item,
      tab_model: 'tab0',
      connector: newConnectors,
    };
  });
  return panels.filter((p) => p.show);
};

export const getNewPanels = (panels) => {
  const output = [];
  panels.forEach((panel) => {
    const el = JSON.parse(JSON.stringify(panel));
    el.tab_model = 'tab0';
    output.push(el);
  });
  return output.filter((p) => p.show);
};
