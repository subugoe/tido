<template>
  <q-card flat>
    <q-tabs v-model="tab" active-bg-color="grey-4" align="right">
      <q-tab v-for="panel in panels"
        :key="panel.order"
        :label="panel.heading"
        :name="panel.heading"
      />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated class="content-panel" keep-alive>
      <q-tab-panel v-for="panel in panels" :key="panel.order" :name="panel.heading">
        <component :is="panel.heading" v-bind="$props" />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script>
import Metadata from '@/components/metadata.vue';
import Treeview from '@/components/tree.vue';

export default {
  name: 'Tabs',
  components: {
    Metadata,
    Treeview,
  },
  props: {
    collection: Object,
    config: Object,
    itemlabel: String,
    labels: Object,
    language: String,
    manifests: Array,
    tree: Array,
  },
  data() {
    return {
      panels: [],
      tab: '',
    };
  },
  created() {
    Object.values(this.config.panels).forEach((panel) => {
      if (panel.tab === true) {
        this.panels.push(panel);
      }
    });
    this.tab = this.config.panels.tabs.default;
  },
  mounted() {
  },
};
</script>
