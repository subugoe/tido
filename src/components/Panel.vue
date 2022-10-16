<template>
  <div class="item-content" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
    <div class="panel-header q-py-xs q-pr-sm q-pl-md flex justify-between items-center">
      <div class="caption text-bold text-body1">
        <!-- We display the tab label as panel label when there is only one tab -->
        <span v-if="panel.label && tabs.length > 1 || tabs.length === 0">{{ $t(panel.label) }}</span>
        <span v-else-if="tabs.length === 1">{{tabs[0].label}}</span>
      </div>
      <div class="actions">
        <template v-for="(tab, i) in tabs" :key="i">
          <template v-for="({ component, props, events }, j) in tab.actions" :key="j">
            <component v-show="i === activeTabIndex" :is="component" v-bind="props" v-on="events" />
          </template>
        </template>
      </div>
    </div>
    <q-separator />
    <div class="panel-body q-pa-sm">
      <template v-if="tabs.length > 1">
        <div class="tabs-container">
          <q-tabs
            v-model="activeTabIndex"
            @update:model-value="onViewChange"
            class="content-tabs"
            :active-color="'primary'"
            :active-bg-color="$q.dark.isActive ? 'bg-dark' : 'bg-grey-4'"
            dense
          >
            <q-tab v-for="(tab, i) in tabs" :key="tab.id" :name="i" :label="tab.label" no-caps />
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
      <Notification
        v-else
        :title="$t('config_error')"
        :message="$t('no_views_configured')"
        type="warning"
        style="margin-top: 5rem"
      />
    </div>
  </div>
</template>

<script>
import Metadata from 'components/metadata/Metadata.vue';
import Tree from '@/components/Tree.vue';
import Annotations from '@/components/annotations/Annotations.vue';
import Content from '@/components/Content.vue';
import OpenSeadragon from '@/components/OpenSeadragon.vue';
import { findComponent } from "src/utils/panels";
import PanelActionZoom from 'components/panels/PanelActionZoom.vue';
import Notification from 'components/Notification.vue';
import PanelToggleAction from 'components/panels/PanelToggleAction.vue';

export default {
  components: {
    Tree,
    Annotations,
    Content,
    Metadata,
    OpenSeadragon,
    PanelActionZoom,
    PanelToggleAction,
    Notification
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
      activeTabIndex: 0,
      internalFs: 16
    };
  },
  computed: {
    item() {
      return this.$store.getters['contents/item'];
    },
    fontSize() {
      return this.internalFs;
    }
  },
  mounted() {
    console.log('panel mounted');
    this.$store.subscribeAction(async ({ type, payload }) => {
      if (this.tabs.length && this.tabs[0].actions?.length && type === 'annotations/updatePanelAction') {
        this.tabs[0].actions[0].selected = payload;
      }
    });
  },
  methods: {
    getContentUrl(type) {
      const contentItem = this.item.content.find(c => c.type.split('type=')[1] === type);
      return contentItem ? contentItem.url : null;
    },
    init(views) {
      this.tabs = [];
      views.forEach((view, i) => {
        const { connector, label } = view;
        const { component } = findComponent(connector.id);
        const methodName = 'render' + component;

        if (!this[methodName]) return;
        this[methodName](view, i);
        return;

        if (component === 'Content') {

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
      // this.tabs = tabs;
    },
    renderContent(view, i) {
      const { connector, label } = view;
      const { component } = findComponent(connector.id);

      const type = connector.options?.type;
      const url = this.getContentUrl(type);
      if (!url) return;

      const fontSize = 16;
      const events = {
        update: (value) => {
          this.tabs[i].props.fontSize = value;
        }
      };

      const actions = [{
        component: 'PanelActionZoom',
        props: { min: 14, max: 28, step: 1, startValue: fontSize },
        events
      }];

      this.tabs = [...this.tabs, {
        component,
        label,
        props: { type, url, fontSize },
        actions: [],
        events
      }];
    },
    renderAnnotations(view) {
      const { connector, label } = view;
      const { component } = findComponent(connector.id);

      const url = this.item.annotationCollection;

      if (!url) return;

      const selected = false;
      const events = {
        update: (value) => {
          this.$store.dispatch(value ? 'annotations/selectAll' : 'annotations/selectNone');
        }
      };

      let actions = [{
        component: 'PanelToggleAction',
        props: { selected },
        events
      }];

      this.tabs = [...this.tabs, {
        component,
        label,
        props: { url, ...connector.options },
        actions
      }];
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
.panel-header {
  min-height: 48px;
}
.panel-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
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
  border-radius: 6px;
  border: 1px solid #ddd !important;

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
