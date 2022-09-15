<template>
  <!-- shows the nested tabs -->
  <div
    v-if="tabs.length > 1"
    class="item-content"
  >
    <div class="tabs-container">
      <q-tabs
        v-for="(tab, i) in tabs"
        :key="`pt${i}`"
        :model-value="connectorValue"
        @update:model-value="onTabChange"
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
      v-model="connectorValue"
      animated
      keep-alive
    >
      <q-tab-panel
        v-for="(tab, idx) in tabs"
        :key="`co${idx}`"
        :name="`tab${idx}`"
        class="q-pa-none"
      >
        <component
          :is="tab.component"
          :key="tab.id"
          v-bind="tab.props"
        />
      </q-tab-panel>
    </q-tab-panels>
  </div>

  <!-- shows the panels -->
  <div
    v-else-if="tabs.length === 1"
    class="item-content"
  >
    <component
      :is="tabs[0].component"
      :key="tabs[0].id"
      :props="tabs[0].props"
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
      default: () => { },
    },
    index: {
      type: Number,
    },
  },
  data() {
    return {
      tabs: [],
    };
  },
  computed: {
    contentUrls() {
      return this.$store.getters['contents/contentUrls'];
    },
    imageUrl() {
      return this.$store.getters['contents/imageUrl'];
    },
    connectorValue() {
      return this.$store.getters['contents/connectorValues'][this.index] || 'tab0';
    },
  },
  methods: {
    onTabChange(value) {
      return this.$store.dispatch('contents/setConnectorValues', { value, panelIndex: this.index });
    },
  },
  watch: {
    panel: {
      handler(value) {
        console.log(this.contentUrls);
        const connectors = value.connector;
        connectors.forEach((c, i) => {
          if (c.component === 'Content') {
            if (this.contentUrls[i]) {
              this.tabs.push({
                ...c,
                label: this.contentUrls[i].type.split('type=')[1] ?? '',
                props: { ...this.contentUrls[i] }
              });
            }
          } else {
            this.tabs.push(c);
          }
        });
        console.log(this.tabs)
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

  >* {
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
    flex-direction: column;
    flex: 1;
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
