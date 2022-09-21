<template>
  <div class="item-content">
    <div v-if="panel.label" class="text-body1 text-weight-medium text-center q-pb-xs q-pt-xs">
      {{ panel.label }}
    </div>
    <q-separator />
    <template v-if="tabs.length > 1">
      <div class="tabs-container">
        <q-tabs
          v-model="activeTabIndex"
          class="content-tabs"
          :active-bg-color="$q.dark.isActive ? 'bg-black' : 'bg-grey-4'"
          dense
        >
          <q-tab
            v-for="(tab, i) in tabs"
            :key="tab.id"
            :name="i"
            :label="tab.label"
          />
        </q-tabs>
      </div>
      <q-tab-panels v-model="activeTabIndex" animated keep-alive>
        <q-tab-panel
          v-for="(tab, idx) in tabs"
          :key="`co${idx}`"
          :name="`tab${idx}`"
          class="q-pa-none"
        >
          <component :is="tab.component" :key="tab.id" v-bind="tab.props" />
        </q-tab-panel>
      </q-tab-panels>
    </template>
    <template v-else-if="tabs.length === 1">
      <component :is="tabs[0].component" :key="tabs[0].id" :props="tabs[0].props" />
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
    },
    content() {
      return this.item?.content || [];
    }
  },
  mounted() {
    console.log('panel mounted');
  },
  watch: {
    activeTabIndex: {
      handler() {
        this.$emit('active-view', this.activeTabIndex);
      }
    },
    panel: {
      handler({ views }) {
        views.forEach((view, i) => {
          const { connector, label } = view;
          const { component } = findComponent(connector.id);

          if (component === 'Content') {
            const type = connector.options?.type;
            const canShowContent = this.content.findIndex((contentItem) => {
              return contentItem.type.split('type=')[1] === type;
            }) > -1;

            if (!canShowContent) return;

            this.tabs.push({
              component,
              label,
              props: { ...connector.options }
            });
          } else {
            this.tabs.push(view);
          }
        });
        console.log(this.tabs)
      },
      deep: true,
      immediate: true,
    },
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
