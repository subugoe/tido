import Content from '@/components/content.vue';
import Metadatatab from '@/components/tab-panels/metadatatab.vue';
import OpenSeadragon from '@/components/openseadragon.vue';
import Treeviewtab from '@/components/tab-panels/treeviewtab.vue';
import { v4 as uuidv4 } from 'uuid';

// -- Panels --
// Connector requires "component id" that combines panels into tabs.
const panels = [
  {
    id: uuidv4(),
    connector: [1, 2],
    panel_label: 'Tabs',
    show: true,
    tab_model: null,
  },
  {
    id: uuidv4(),
    connector: [3],
    panel_label: 'Image',
    show: true,
  },
  {
    id: uuidv4(),
    connector: [4],
    panel_label: 'Text',
    show: true,
  },
  {
    id: uuidv4(),
    connector: [5],
    panel_label: 'Annotations',
    show: true,
  },
];

export default {
  data: () => ({
    components: {
      1: {
        component: Treeviewtab,
        label: 'Contents',
      },
      2: {
        component: Metadatatab,
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
    panels,
  }),
  methods: {
    findComponent(id) {
      return {
        id,
        ...this.components[id],
      };
    },

    setupPanels() {
      // will change all id => component
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
      return this.panels;
    },
  },
  mounted() {
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
        // Add the componet to the new panel

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
