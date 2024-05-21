<template>
  <div class="panel t-flex-1 t-flex t-flex-col t-overflow-hidden t-rounded-lg t-bg-gray-50 dark:t-bg-gray-800 t-border dark:t-border-gray-700">
    <div class="panel-header t-py-3 t-px-4 t-flex t-justify-between t-items-center">
      <div class="caption t-font-bold">
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
    <div class="t-h-[1px] dark:t-bg-gray-600 t-bg-gray-200 t-mx-4" />
    <div class="panel-body t-relative t-overflow-hidden t-flex t-flex-1 t-flex-col t-bg-none">
      <div v-if="isLoading" class="t-absolute t-z-50 t-flex t-bg-gray-50 dark:t-bg-gray-800 t-w-full t-h-full t-justify-center t-items-center">
        <Loading  class="t-text-5xl" />
      </div>
      <template v-if="tabs.length > 1">
        <TabView
          v-model:active-index="activeTabIndex"
          @update:active-index="onViewChange"
          unstyled
          :pt="{
              navContent: {
                class: ['t-mx-4']
              },
              nav: ({ props, parent, context })=>({
                  class:[
                    't-relative t-mr-0 t-flex t-list-none t-overflow-hidden',
                    {
                      't-opacity-60 t-cursor-default t-user-select-none t-select-none t-pointer-events-none': props == null ? void 0 : props.disabled
                    },
                  ]
                }),
              tabpanel: {
                header: ({ parent, context }) => ({
                  class: [
                    't-flex-1 t-relative t-text-sm',
                    'after:t-content-[\'\'] after:t-absolute after:t-flex after:t-bottom-0 after:t-h-[2px] after:t-w-full after:t-bg-primary',
                    { 'after:t-opacity-0': parent.state.d_activeIndex !== context.index },
                    { 't-bg-primary/5 t-text-primary after:t-opacity-1': parent.state.d_activeIndex === context.index }
                  ]
                }),
                headerAction: { class: [
                    't-relative t-cursor-pointer t-border-b t-border-gray-200',
                    't-flex t-items-center t-justify-center','t-px-3 t-pb-3 t-pt-4',
                    't-transition-all hover:dark:t-bg-gray-600/50 hover:t-bg-gray-300/30'
                  ]
                },
                headerTitle: {
                  class: ['t-leading-none', 't-whitespace-nowrap']
                },
                content: {
                  class: ['t-overflow-auto']
                }
              },
              inkbar: () => ({
                class: [
                  't-hidden'
                ]
              }),
              root: {
                class: ['t-flex t-flex-col t-flex-1 t-overflow-hidden t-h-full t-flex-1']
              },
              panelContainer: {
                class: ['t-flex t-flex-col t-flex-1 t-overflow-hidden']
              }
            }"
        >
          <TabPanel v-for="(tab, i) in tabs" :key="tab.id" :header="$t(tab.label)" unstyled>
            <component v-if="activeTabIndex === i" :is="tab.component" :key="tab.id" v-bind="tab.props" v-on="tab.events" @loading="isLoading = $event" />
          </TabPanel>
        </TabView>
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

<script lang="ts">
import {
  computed, nextTick, ref, watch,
} from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
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
    TabView,
    TabPanel,
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

    const tabs = ref([]);
    const activeTabIndex = ref(0);
    const unsubscribe = ref(null);
    const isLoading = ref(false);

    const item = computed<Item>(() => store.getters['contents/item']);

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
      const url: string | null = getContentUrl(type);
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

      const url: string | undefined = item.value?.annotationCollection;

      if (!url) return;

      const selected = false;
      const events = {
        update: (value) => {
          if (value === null) return;
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
          if (!newSelected && Object.keys(payload).length > 0) newSelected = null;
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

    function getContentUrl(type: string): string | null {
      let contentItem: Content | null = null;
      if (!type) {
        [contentItem] = item.value.content;
        // TODO: this should be moved to loading time in order dynamically recognize all content types
        //  instead of only the first one
        store.dispatch('config/setContentType', contentItem.type.split('type=')[1]);
      }

      contentItem = item.value.content.find((c) => c.type.split('type=')[1] === type);

      return contentItem ? contentItem.url : null;
    }

    function onViewChange(index) {
      activeTabIndex.value = index;
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
