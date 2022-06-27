<template>
  <!-- shows the nested tabs -->
  <div
    v-if="panel.connector.length > 1"
    class="item-content"
  >
    <div class="tabs-container">
      <q-tabs
        v-for="(tab, i) in panel.connector"
        :key="`pt${i}`"
        v-model="value"
        class="content-tabs"
        :active-bg-color="$q.dark.isActive ? 'bg-black' : 'bg-grey-4'"
        dense
      >
        <q-tab
          :name="`tab${i}`"
          :label="$t(tab.label)"
        />
      </q-tabs>
    </div>

    <q-tab-panels
      v-model="value"
      animated
      keep-alive
    >
      <q-tab-panel
        v-for="(tab, idx) in panel.connector"
        :key="`co${idx}`"
        :name="`tab${idx}`"
        class="q-pa-none"
      >
        <component
          :is="tab.component"
          :key="tab.id"
        />
      </q-tab-panel>
    </q-tab-panels>
  </div>

  <!-- shows the panels -->
  <div
    v-else-if="panel.connector.length === 1"
    class="item-content"
  >
    <component
      :is="panel.connector[0].component"
      :key="panel.connector[0].id"
    />
  </div>
</template>

<script>
import Metadata from 'components/metadata/Metadata.vue';
import Tree from '@/components/Tree.vue';
import Annotations from '@/components/annotations/Annotations.vue';
import Content from '@/components/Content.vue';
import OpenSeadragon from '@/components/OpenSeadragon.vue';

export default {
  components: {
    Tree,
    Annotations,
    Content,
    Metadata,
    OpenSeadragon,
  },
  props: {
    panel: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    value: '',
  }),
  computed: {
    contentUrls() {
      return this.$store.getters['contents/contentUrls'];
    },
    imageUrl() {
      return this.$store.getters['contents/imageUrl'];
    },
  },
  watch: {
    panel: {
      handler(newVal) {
        this.value = newVal.tab_model;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs-container {
  display: flex;
  > * {
    flex: 1;
  }
}

.content-tabs {
  display: inline-block;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .q-tab-panels {
    display: flex;
    flex-direction:column;
    flex:1;
  }
}

.item {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  @media (max-width: $breakpoint-sm-custom-md) {
    min-height: 100vh;
  }
}
</style>
