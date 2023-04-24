<template>
  <div class="item-content" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-white'">
    <div class="panel-header q-py-xs q-pr-md q-pl-md flex justify-between items-center">
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
    <div class="panel-body overflow-hidden bg-none">
      <Loading v-if="isLoading" />
      <template v-if="tabs.length > 1">
        <div class="tabs-container q-px-md">
          <q-tabs
            v-model="activeTabIndex"
            @update:model-value="onViewChange"
            :active-color="'primary'"
            active-bg-color="none"
            dense
          >
            <q-tab v-for="(tab, i) in tabs" :key="tab.id" :name="i" :label="$t(tab.label)" no-caps />
          </q-tabs>
        </div>
        <q-tab-panels v-model="activeTabIndex" class="bg-transparent" animated transition-next="fade" transition-prev="fade">
          <q-tab-panel v-for="(tab, i) in tabs" :key="i" :name="i" class="q-pt-md">
            <component :is="tab.component" :key="tab.id" v-bind="tab.props" v-on="tab.events" />
          </q-tab-panel>
        </q-tab-panels>
      </template>
      <template v-else-if="tabs.length === 1">
        <component :is="tabs[0].component" :key="tabs[0].id" v-bind="tabs[0].props" @loading="isLoading = $event" />
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
import MetadataView from '@/components/metadata/MetadataView.vue';
import TreeView from '@/components/TreeView.vue';
import AnnotationsView from '@/components/annotations/AnnotationsView.vue';
import ContentView from '@/components/ContentView.vue';
import ImageView from '@/components/ImageView.vue';
import PanelZoomAction from '@/components/panels/actions/PanelZoomAction.vue';
import PanelToggleAction from '@/components/panels/actions/PanelToggleAction.vue';
import PanelImageAction from '@/components/panels/actions/PanelImageAction.vue';
import Loading from '@/components/Loading.vue';
import Notification from '@/components/Notification.vue';
import { findComponent } from '@/utils/panels';

export default {
  components: {
    TreeView,
    AnnotationsView,
    ContentView,
    MetadataView,
    ImageView,
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
      let contentItem = null;
      if (!type) {
        [contentItem] = this.item.content;
        // TODO: this should be moved to loading time in order dynamically recognize all content types
        //  instead of only the first one
        this.$store.dispatch('config/setContentType', contentItem.type.split('type=')[1]);
      }

      contentItem = this.item.content.find((c) => c.type.split('type=')[1] === type);

      return contentItem ? contentItem.url : null;
    },
    init(views) {
      this.tabs = [];
      if (this.unsubscribe !== null) this.unsubscribe();

      views.forEach((view, i) => {
        const { component } = findComponent(view.connector.id);
        let methodName = `create${component}`;
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
      const actionEvents = {
        update: (value) => {
          this.tabs[i].props.fontSize = value;
        },
      };

      const actions = [{
        component: 'PanelZoomAction',
        props: {
          min: 14, max: 28, step: 2, startValue: fontSize,
        },
        events: actionEvents,
      }];

      this.tabs = [...this.tabs, {
        component,
        label,
        props: { type, url, fontSize },
        actions,
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
          const activeAmount = Object.keys(payload).length;
          const filteredAmount = this.$store.getters['annotations/filteredAnnotations'].length;

          let newSelected = activeAmount > 0 && activeAmount === filteredAmount;
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
    createImageView(view) {
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
  flex-wrap: unset;
}
.panel-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
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

  .q-tabs {
    transition: none !important;
  }

  .q-tab {
    transition: none !important;
    .q-tab__label {
      font-size: $body-font-size;
      font-weight: 300;
    }
  }

  .q-tab-panels {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .q-tab-panel {
    padding: 0;
  }
}

.item {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: $breakpoint-sm-max) {
    min-height: 100%;
  }
}
</style>
