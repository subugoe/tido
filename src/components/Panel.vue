<template>
  <div class="item-content">
    <div class="text-body1 text-weight-medium text-center q-pb-xs q-pt-xs">
      <!-- We display the tab label as panel label when there is only one tab -->
      <span v-if="panel.label && tabs.length > 1">{{ $t(panel.label) }}</span>
      <span v-else-if="tabs.length === 1">{{tabs[0].label}}</span>
    </div>
    <q-separator />
    <template v-if="tabs.length > 1">
      <div class="tabs-container">
        <q-tabs
          v-model="activeTabIndex"
          @update:model-value="onViewChange"
          class="content-tabs"
          :active-bg-color="$q.dark.isActive ? 'bg-black' : 'bg-grey-4'"
          dense
        >
          <q-tab v-for="(tab, i) in tabs" :key="tab.id" :name="i" :label="tab.label" />
        </q-tabs>
      </div>
      <q-tab-panels v-model="activeTabIndex" animated>
        <q-tab-panel v-for="(tab, i) in tabs" :key="i" :name="i" class="q-pa-none">
          <component :is="tab.component" :key="tab.id" v-bind="tab.props" />
        </q-tab-panel>
      </q-tab-panels>
    </template>
    <template v-else-if="tabs.length === 1">
      <component :is="tabs[0].component" :key="tabs[0].id" v-bind="tabs[0].props" />
    </template>
  </div>
</template>

<script>
import Metadata from 'components/metadata/Metadata.vue';
import Tree from '@/components/Tree.vue';
import Annotations from '@/components/annotations/Annotations.vue';
import Content from '@/components/Content.vue';
import OpenSeadragon from '@/components/OpenSeadragon.vue';
import { findComponent } from "src/utils/panels";

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
  },
  data() {
    return {
      tabs: [],
      activeTabIndex: 0
    };
  },
  computed: {
    item() {
      return this.$store.getters['contents/item'];
    }
  },
  mounted() {
    console.log('panel mounted');
  },
  methods: {
    getContentUrl(type) {
      const contentItem = this.item.content.find(c => c.type.split('type=')[1] === type);
      return contentItem ? contentItem.url : null;
    },
    init(views) {
      const tabs = [];
      views.forEach((view, i) => {
        const { connector, label } = view;
        const { component } = findComponent(connector.id);
        if (component === 'Content') {
          const type = connector.options?.type;
          const url = this.getContentUrl(type);

          if (!url) return;

          tabs.push({
            component,
            label,
            props: { type, url}
          });
        } else if (component === 'Annotations') {
          const url = this.item.annotationCollection;

          if (!url) return;

          tabs.push({
            component,
            label,
            props: { url, ...connector.options }
          });
        } else if (component === 'Metadata') {
          const { options } = connector;
          tabs.push({
            component,
            label,
            props: { options }
          });
        } else {
          tabs.push({
            component,
            label,
            props: { ...connector.options }
          });
        }
      });
      this.tabs = tabs;
    },
    onViewChange(event) {
      this.$emit('active-view', this.activeTabIndex);
    }
  },
  watch: {
    panel: {
      handler({ views, active, label }) {
        this.activeTabIndex = active;
        this.init(views);
      },
      deep: true,
      immediate: true,
    },
    item: {
      handler() {
        this.init(this.panel.views);
      }
    }
  }
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
