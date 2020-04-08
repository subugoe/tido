<template>
  <div>
    <q-drawer bordered show-if-above side="left" v-model="node" :width="$q.screen.width / 5">
      <Toolbar heading="Treeview" />
      <q-separator />

      <q-tabs v-model="tab" shrink>
        <q-route-tab to="/" exact label="TwinView" />
        <q-route-tab to="/text" exact label="TextView" />
        <q-route-tab to="/image" exact label="ImageView" />
      </q-tabs>
      <q-separator />&nbsp;

      <Treeview
        :depth="depth"
        :itemurl="itemurl"
        :itemurls="itemurls"
        :label="label"
        :manifests="manifests"
        :tree="tree"
        :vectors="vectors"
        >
      </Treeview>
    </q-drawer>

    <q-drawer bordered show-if-above side="right" v-model="meta" :width="$q.screen.width / 5">
      <Toolbar heading="Metadata" />
      <q-separator />

      <Metadata v-if="manifests.length"
        :collection="collection"
        :manifests="manifests"
        >
      </Metadata>
    </q-drawer>
  </div>
</template>

<script>
import Metadata from '@/components/metadata.vue';
import Toolbar from '@/components/quasar-toolbar.vue';
import Treeview from '@/components/treeview.vue';

export default {
  name: 'Drawer',
  components: {
    Metadata,
    Toolbar,
    Treeview,
  },
  props: {
    collection: Object,
    depth: Number,
    itemurl: String,
    itemurls: Array,
    label: String,
    manifests: Array,
    tree: Array,
    vectors: Object,
  },
  data() {
    return {
      meta: true,
      node: true,
      tab: 'Twin',
    };
  },
  mounted() {
    this.$root.$on('update-panel-status', (status) => {
      this.meta = status.metadata;
      this.node = status.treeview;
    });
  },
};
</script>
