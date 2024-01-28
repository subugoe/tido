<template>
  <div class="item-content dark:t-bg-gray-800 t-border dark:t-border-gray-600">
    <div class="panel-header t-py-1 t-pr-4 t-pl-4 flex justify-between items-center">
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
    <q-separator class="t-mx-4" />
    <div class="panel-body overflow-hidden bg-none">
      <Loading v-if="isLoading" />
      <template v-if="tabs.length > 1">
        <div class="tabs-container t-px-4">
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
          <q-tab-panel v-for="(tab, i) in tabs" :key="i" :name="i" class="q-pt-4">
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
import {
  computed, nextTick, ref, watch,
} from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useDark } from '@vueuse/core';
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

// NOTE: Using `setup()` rather than the recommended `<script setup>`
// to avoid issues with asset loading.
export default {
  components: {
    AnnotationsView,
    ContentView,
    ImageView,
    Loading,
    MetadataView,
    Notification,
    PanelImageAction,
    PanelToggleAction,
    PanelZoomAction,
    TreeView,
  },
  props: {
    panel: {
      type: Object,
      default: () => { },
    },
    activeView: Number,
  },
  setup(props, { emit }) {
    const store = useStore();
    const { t } = useI18n();
    const isDark = useDark();

    const tabs = ref([]);
    const activeTabIndex = ref(0);
    const unsubscribe = ref(null);
    const isLoading = ref(false);

    const item = computed(() => store.getters['contents/item']);

    watch(
      () => props.activeView,
      (value) => {
        activeTabIndex.value = value;
      },
      { immediate: true },
    );

    watch(
      () => props.panel,
      ({ views }) => {
        nextTick(() => {
          init(views);
        });
      },
      { deep: true, immediate: true },
    );
    watch(
      item,
      () => {
        init(props.panel.views);
      },
    );

    function init(views) {
      tabs.value = [];
      if (unsubscribe.value !== null) unsubscribe.value();

      views.forEach((view, i) => {
        const { component } = findComponent(view.connector.id);

        switch (component) {
          case 'ContentView':
            return createContentView(view, i);
          case 'TreeView':
            return createTreeView(view, i);
          case 'MetadataView':
            return createMetadataView(view, i);
          case 'ImageView':
            return createImageView(view, i);
          case 'AnnotationsView':
            return createAnnotationsView(view, i);
          default:
            return createDefaultView(view, i);
        }
      });
    }

    function createContentView(view, i) {
      const { connector, label } = view;
      const { component } = findComponent(connector.id);

      const type = connector.options?.type;
      const url = getContentUrl(type);
      if (!url) return;

      const fontSize = 16;
      const actionEvents = {
        update: (value) => {
          tabs.value[i].props.fontSize = value;
        },
      };

      const actions = [{
        component: 'PanelZoomAction',
        props: {
          min: 14, max: 28, step: 2, startValue: fontSize,
        },
        events: actionEvents,
      }];

      tabs.value = [...tabs.value, {
        component,
        label,
        props: { type, url, fontSize },
        actions,
      }];
    }

    function createAnnotationsView(view, i) {
      const { connector, label } = view;
      const { component } = findComponent(connector.id);

      const url = item.value?.annotationCollection;

      if (!url) return;

      const selected = false;
      const events = {
        update: (value) => {
          if (value === 'maybe') return;
          store.dispatch(value ? 'annotations/selectAll' : 'annotations/selectNone');
        },
      };

      unsubscribe.value = store.subscribeAction(async ({ type, payload }) => {
        if (tabs.value.length
          && tabs.value[0]?.actions?.length
          && type === 'annotations/setActiveAnnotations'
        ) {
          const activeAmount = Object.keys(payload).length;
          const filteredAmount = store.getters['annotations/filteredAnnotations'].length;

          let newSelected = activeAmount > 0 && activeAmount === filteredAmount;
          if (!newSelected && Object.keys(payload).length > 0) newSelected = 'maybe';
          if (tabs.value[i].actions[0].props.selected !== newSelected) {
            tabs.value[i].actions[0].props.selected = newSelected;
          }
        }
      });

      const actions = [{
        component: 'PanelToggleAction',
        props: {
          selected,
          label: t('select_all'),
        },
        events,
      }];

      tabs.value = [...tabs.value, {
        component,
        label,
        props: { url, ...connector.options },
        actions,
      }];
    }

    function createMetadataView(view) {
      const { connector, label } = view;
      const { component } = findComponent(connector.id);
      const { options } = connector;
      tabs.value = [...tabs.value, {
        component,
        label,
        props: { options },
      }];
    }

    function createTreeView(view) {
      createDefaultView(view);
    }

    function createImageView(view) {
      const { connector, label } = view;
      const { component } = findComponent(connector.id);
      tabs.value = [...tabs.value, {
        component,
        label,
        props: { ...connector.options },
        actions: [{
          component: 'PanelImageAction',
        }],
      }];
    }

    function createDefaultView(view) {
      const { connector, label } = view;
      const { component } = findComponent(connector.id);
      tabs.value = [...tabs.value, {
        component,
        label,
        props: { ...connector.options },
      }];
    }

    function getContentUrl(type) {
      let contentItem = null;
      if (!type) {
        [contentItem] = item.value.content;
        // TODO: this should be moved to loading time in order dynamically recognize all content types
        //  instead of only the first one
        store.dispatch('config/setContentType', contentItem.type.split('type=')[1]);
      }

      contentItem = item.value.content.find((c) => c.type.split('type=')[1] === type);

      return contentItem ? contentItem.url : null;
    }

    function onViewChange() {
      emit('active-view', activeTabIndex.value);
    }

    return {
      activeTabIndex,
      isLoading,
      panel: props.panel,
      tabs,
      onViewChange,
    };
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
