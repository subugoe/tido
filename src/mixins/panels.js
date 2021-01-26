import Content from '@/components/content.vue';
import Metadata from '@/components/metadata.vue';
import OpenSeadragon from '@/components/openseadragon.vue';
import Treeview from '@/components/tree.vue';

import { v4 as uuidv4 } from 'uuid';

export default {
  data: () => ({
    components: {
      1: {
        component: Treeview,
        label: 'Contents',
      },
      2: {
        component: Metadata,
        label: 'Metadata',
      },
      3: {
        component: OpenSeadragon,
        label: 'Image',
      },
      4: {
        component: Content,
        label: 'Text',
      },
      5: {
        component: null,
        label: 'Annotations',
      },
    },
    panels: [],
  }),
  methods: {
    findComponent(id) {
      return {
        id,
        ...this.components[id],
      };
    },

    // read the panel config and extend it by unique IDs
    preparePanels() {
      // get the "panels part" from the json object defined in src/index.template.html
      [this.panels] = [JSON.parse(document.getElementById('tido-config').text).panels];

      // each panel needs a unique ID to distinguish it from one another (dynamic components)
      // since it's not a config option, the IDs are pushed after reading the related panel config options
      Object.values(this.panels).forEach((panel) => {
        panel.id = uuidv4();
      });
    },

    setupPanels() {
      // will change all ids => component
      this.panels = this.panels.map((item) => {
        const newConnectors = item.connector.map(
          (c) => (typeof c === 'number' ? this.findComponent(c) : c),
        );
        return {
          ...item,
          tab_model: 'tab0',
          connector: newConnectors,
        };
      });
      return this.panels.filter((p) => p.show);
    },
  },
  mounted() {
    this.preparePanels();
    this.panels = this.setupPanels();

    this.$root.$on('panels-position', (newPanels) => {
      this.panels = newPanels;
    });

    this.$root.$on('add-panel', () => {
      const newPanel = {
        id: uuidv4(),
        panel_label: 'New Panel',
        connector: [],
        tab_model: 'tab0',
        show: true,
      };
      this.panels.push(newPanel);
    });

    this.$root.$on('update-panellabel', (payload) => {
      const value = payload.v || ' ';
      this.panels[payload.index].panel_label = value;
    });

    this.$root.$on('handle-connector', (payload) => {
      const {
        from,
        to,
        idC,
      } = payload;
      const component = this.findComponent([idC]);

      if (from !== to) {
        // Add the component to the new panel

        this.panels[to].connector.push(component);

        // Remove the component from the previous panel

        const fromPanel = this.panels[from];

        fromPanel.connector = fromPanel.connector.filter((c) => c.id !== idC);

        // Check if it is the last component inside the panel, then remove the panel

        if (!fromPanel.connector.length) this.$root.$emit('remove-panel', fromPanel.id);
      }
    });

    this.$root.$on('remove-panel', (id) => {
      this.panels = this.panels.filter((c) => c.id !== id);
    });
  },
};
