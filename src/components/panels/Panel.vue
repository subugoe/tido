<template>
  <div class="item-content" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-white'">
    <div class="panel-header q-py-xs q-pr-sm q-pl-md flex justify-between items-center">
      <div class="caption text-bold text-body1">
        <!-- We display the tab label as panel label when there is only one tab -->
        <span v-if="panel.label && tabs.length > 1 || tabs.length === 0">{{ $t(panel.label) }}</span>
        <span v-else-if="tabs.length === 1">{{$t(tabs[0].label)}}</span>
      </div>
      <div class="actions">
        <template v-for="(tab, i) in tabs" :key="i">
          <template v-for="({ component, props, events}, j) in tab.actions" :key="j">
            <component v-show="i === activeTabIndex" :is="component" v-bind="props" v-on="events" />
          </template>
        </template>
      </div>
    </div>
    <q-separator class="q-mx-md" />
    <div class="panel-body bg-none q-px-md">
      <Loading v-if="isLoading" />
      <template v-if="tabs.length > 1">
        <div class="tabs-container">
          <q-tabs
            v-model="activeTabIndex"
            @update:model-value="onViewChange"
            :active-color="'primary'"
            :active-bg-color="$q.dark.isActive ? 'bg-dark' : 'bg-grey-4'"
            dense
          >
            <q-tab v-for="(tab, i) in tabs" :key="tab.id" :name="i" :label="$t(tab.label)" no-caps />
          </q-tabs>
        </div>
        <q-tab-panels v-model="activeTabIndex" class="bg-transparent" animated transition-next="fade" transition-prev="fade">
          <q-tab-panel v-for="(tab, i) in tabs" :key="i" :name="i" class="q-pt-md">
            <component :is="tab.component" :key="tab.id" v-bind="tab.props" />
          </q-tab-panel>
        </q-tab-panels>
      </template>
      <template v-else-if="tabs.length === 1">
        <div class="q-pt-md">
          <component :is="tabs[0].component" :key="tabs[0].id" v-bind="tabs[0].props" @loading="isLoading = $event" />
        </div>
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
import Metadata from '@/components/metadata/Metadata.vue';
import Tree from '@/components/Tree.vue';
import Annotations from '@/components/annotations/Annotations.vue';
import Content from '@/components/Content.vue';
import OpenSeadragon from '@/components/OpenSeadragon.vue';
import { findComponent } from '@/utils/panels';
import PanelZoomAction from '@/components/panels/actions/PanelZoomAction.vue';
import Notification from '@/components/Notification.vue';
import PanelToggleAction from '@/components/panels/actions/PanelToggleAction.vue';
import PanelImageAction from '@/components/panels/actions/PanelImageAction.vue';
import Loading from '@/components/Loading.vue';

export default {
  components: {
    Tree,
    Annotations,
    Content,
    Metadata,
    OpenSeadragon,
    PanelZoomAction,
    PanelToggleAction,
    PanelImageAction,
    Notification,
    Loading,
  },
  props: {
    panel: {
      type: Object,
      default: () => { },
    },
    activeView: Number,
  },
  data() {
    return {
      tabs: [],
      activeTabIndex: 0,
      unsubscribe: null,
      isLoading: false,
    };
  },
  computed: {
    item() {
      return this.$store.getters['contents/item'];
    },
  },
  methods: {
    getContentUrl(type) {
      const contentItem = this.item.content.find((c) => c.type.split('type=')[1] === type);
      return contentItem ? contentItem.url : null;
    },
    init(views) {
      this.tabs = [];
      if (this.unsubscribe !== null) this.unsubscribe();

      views.forEach((view, i) => {
        const { component } = findComponent(view.connector.id);
        let methodName = `create${component}View`;
        if (!this[methodName]) methodName = 'createDefaultView';
        this[methodName](view, i);
      });
    },
    createContentView(view, i) {
      const { connector, label } = view;
      const { component } = findComponent(connector.id);

      const type = connector.options?.type;
      const url = this.getContentUrl(type);
      if (!url) return;

      const fontSize = 16;
      const events = {
        update: (value) => {
          this.tabs[i].props.fontSize = value;
        },
      };

      const actions = [{
        component: 'PanelZoomAction',
        props: {
          min: 14, max: 28, step: 2, startValue: fontSize,
        },
        events,
      }];

      this.tabs = [...this.tabs, {
        component,
        label,
        props: { type, url, fontSize },
        actions,
        events,
      }];
    },
    createAnnotationsView(view, i) {
      const { connector, label } = view;
      const { component } = findComponent(connector.id);

      const url = this.item.annotationCollection;

      if (!url) return;

      const selected = false;
      const events = {
        update: (value) => {
          if (value === 'maybe') return;
          this.$store.dispatch(value ? 'annotations/selectAll' : 'annotations/selectNone');
        },
      };

      this.unsubscribe = this.$store.subscribeAction(async ({ type, payload }) => {
        if (this.tabs.length && this.tabs[0].actions?.length && type === 'annotations/setActiveAnnotations') {
          const totalAnnotationsAmount = this.$store.getters['annotations/filteredAnnotations'].length;
          let newSelected = Object.keys(payload).length === totalAnnotationsAmount;

          if (!newSelected && Object.keys(payload).length > 0) newSelected = 'maybe';

          if (this.tabs[i].actions[0].props.selected !== newSelected) this.tabs[i].actions[0].props.selected = newSelected;
        }
      });

      const actions = [{
        component: 'PanelToggleAction',
        props: {
          selected,
          label: this.$t('select_all'),
        },
        events,
      }];

      this.tabs = [...this.tabs, {
        component,
        label,
        props: { url, ...connector.options },
        actions,
      }];
    },
    createMetadataView(view) {
      const { connector, label } = view;
      const { component } = findComponent(connector.id);
      const { options } = connector;
      this.tabs = [...this.tabs, {
        component,
        label,
        props: { options },
      }];
    },
    createTreeView(view) {
      this.createDefaultView(view);
    },
    createOpenSeadragonView(view) {
      const { connector, label } = view;
      const { component } = findComponent(connector.id);
      this.tabs = [...this.tabs, {
        component,
        label,
        props: { ...connector.options },
        actions: [{
          component: 'PanelImageAction',
        }],
      }];
    },
    createDefaultView(view) {
      const { connector, label } = view;
      const { component } = findComponent(connector.id);
      this.tabs = [...this.tabs, {
        component,
        label,
        props: { ...connector.options },
      }];
    },

    onViewChange() {
      this.$emit('active-view', this.activeTabIndex);
    },
  },
  watch: {
    panel: {
      handler({ views }) {
        this.init(views);
      },
      deep: true,
      immediate: true,
    },
    activeView: {
      handler(value) {
        this.activeTabIndex = value;
      },
      immediate: true,
    },
    item: {
      handler() {
        this.init(this.panel.views);
      },
    },
  },
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
  overflow: auto;
  position: relative;

  :deep(.q-tabs__content .q-tab) {
    flex: 1;
  }

  .tabs-container {
    display: flex;

    >* {
      flex: 1;
    }
  }
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #ddd;
  position: relative;

  .body--dark & {
    border: 1px solid #424242 !important;
  }

  .q-tab-panels {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-left: -16px;
    margin-right: -16px;
  }
}

.item {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: $breakpoint-sm-custom-md) {
    min-height: 100%;
  }
}
</style>
