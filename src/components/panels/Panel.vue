<template>
  <div
    class="panel t-flex t-flex-col t-overflow-hidden t-rounded-lg t-bg-gray-50 dark:t-bg-gray-800
    t-border dark:t-border-gray-700 t-max-h-screen md:t-h-auto"
    :style="{ flexBasis, flexGrow, flexShrink }"
  >
    <div class="panel-header t-py-3 t-px-4 t-flex t-justify-between t-items-center">
      <div class="caption t-font-bold">
        <!-- We display the tab label as panel label when there is only one tab -->
        <span v-if="panel.label && tabs.length > 1 || tabs.length === 0">{{ $t(panel.label) }}</span>
        <span v-else-if="tabs.length === 1">{{ $t(tabs[0].label) }}</span>
      </div>
      <div class="actions t-flex t-space-x-2">
        <template
          v-for="(tab, i) in tabs"
          :key="i"
        >
          <template
            v-for="({ component, props, events}, j) in tab.actions"
            :key="j"
          >
            <component
              :is="component"
              v-show="i === activeTabIndex"
              v-bind="props"
              v-on="events"
            />
          </template>
        </template>
      </div>
    </div>
    <div class="t-h-[1px] dark:t-bg-gray-600 t-bg-gray-200 t-mx-4" />
    <div class="panel-body t-relative t-overflow-hidden t-flex t-flex-1 t-flex-col t-bg-none">
      <div
        v-if="isLoading"
        class="t-absolute t-bottom-0 t-z-50 t-flex t-bg-gray-50 dark:t-bg-gray-800 t-w-full t-h-[93%] t-justify-center t-items-center"
      >
        <LoadingSpinner class="t-text-5xl" />
      </div>
      <template v-if="tabs.length > 1">
        <TabView
          v-model:active-index="activeTabIndex"
          unstyled
          :pt="{
            navContent: {
              class: ['t-mx-4']
            },
            nav: ({ props })=>({
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
                't-relative t-cursor-pointer t-border-b t-border-gray-200 dark:t-border-gray-600',
                't-flex t-items-center t-justify-center','t-px-3 t-pb-3 t-pt-4',
                't-transition-all hover:dark:t-bg-gray-600/50 hover:t-bg-gray-300/30'
              ]
              },
              headerTitle: {
                class: ['t-leading-none', 't-whitespace-nowrap']
              },
              content: {
                class: ['t-overflow-auto', 't-grow']
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
          @update:active-index="onViewChange"
        >
          <TabPanel
            v-for="(tab, i) in tabs"
            :key="tab.id"
            :header="$t(tab.label)"
            unstyled
          >
            <component
              :is="tab.component"
              v-if="activeTabIndex === i"
              :key="tab.id"
              v-bind="tab.props"
              v-on="tab.events"
              @loading="isLoading = $event"
            />
          </TabPanel>
        </TabView>
      </template>
      <template v-else-if="tabs.length === 1">
        <component
          :is="tabs[0].component"
          :key="tabs[0].id"
          v-bind="tabs[0].props"
          @loading="isLoading = $event"
        />
      </template>
      <MessageBox
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
  computed, nextTick, onMounted, onUnmounted, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import { useConfigStore } from '@/stores/config';
import { useAnnotationsStore } from '@/stores/annotations';
import { useContentsStore } from '@/stores/contents';
import MetadataView from '@/components/metadata/MetadataView.vue';
import TreeView from '@/components/TreeView.vue';
import AnnotationsView from '@/components/annotations/AnnotationsView.vue';
import VariantsView from '@/components/annotations/variants/VariantsView.vue';
import ContentView from '@/components/ContentView.vue';
import ImageView from '@/components/ImageView.vue';
import PanelZoomAction from '@/components/panels/actions/PanelZoomAction.vue';
import PanelCheckAction from '@/components/panels/actions/PanelCheckAction.vue';
import VariantsToggleModeAction from '@/components/panels/actions/VariantsToggleModeAction.vue';
import PanelImageAction from '@/components/panels/actions/PanelImageAction.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import MessageBox from '@/components/MessageBox.vue';
import { findComponent, getFontSizes } from '@/utils/panels';
import * as AnnotationUtils from '@/utils/annotations'
import { useResize } from "@/utils/resize.js";

// NOTE: Using `setup()` rather than the recommended `<script setup>`
// to avoid issues with asset loading.
export default {
  components: {
    AnnotationsView,
    VariantsView,
    ContentView,
    ImageView,
    LoadingSpinner,
    MetadataView,
    MessageBox,
    PanelImageAction,
    PanelCheckAction,
    PanelZoomAction,
    VariantsToggleModeAction,
    TreeView,
    TabView,
    TabPanel,
  },
  props: {
    panel: {
      type: Object,
      default: () => { },
    },
    panelIndex: Number,
    activeView: Number,
  },
  setup(props, { emit }) {
    const configStore = useConfigStore();
    const contentStore = useContentsStore();
    const { t } = useI18n();
    const { isMobile, onResize } = useResize();

    const defaultWidth = 300;
    const tabs = ref([]);
    const activeTabIndex = ref(0);
    const unsubscribe = ref(null);
    const isLoading = ref(false);
    const flexGrow = ref(1);
    const flexShrink = ref(1);
    const flexBasis = ref('0%');

    const item = computed<Item>(() => contentStore.item);
    const config = computed(() => configStore.config);

    let unsubscribeResize;

    onMounted(() => {
      unsubscribeResize = onResize(() => updateFlexValues(config.value.fitPanels, props.panel.width, isMobile.value));
    });

    onUnmounted(() => {
      if (unsubscribeResize) unsubscribeResize();
    });

    watch(
      () => props.activeView,
      (value) => {
        activeTabIndex.value = value;
      },
      { immediate: true },
    );

    watch(
      () => props.panel, ({ views }) => {
        nextTick(() => init(views))
      },
      { deep: true, immediate: true },
    );

    watch(item,() => init(props.panel.views));

    function init(views) {
      updateFlexValues(config.value.fitPanels, props.panel.width, isMobile.value)

      tabs.value = [];
      if (unsubscribe.value !== null) unsubscribe.value();

      views.forEach((view, i) => {
        const { component } = findComponent(view.connector.id);

        switch (component) {
          case 'ContentView':
            return createContentView(view, i, props.panelIndex);
          case 'TreeView':
            return createTreeView(view);
          case 'MetadataView':
            return createMetadataView(view);
          case 'ImageView':
            return createImageView(view);
          case 'AnnotationsView':
            return createAnnotationsView(view, i);
          case 'VariantsView':
            return createVariantsView(view, i);
          default:
            return createDefaultView(view);
        }
      });
    }

    function updateFlexValues(fitPanels: boolean, widthMultiplier: number, isMobile: boolean) {

      if (isMobile) {
        flexBasis.value = `${90 * getValidatedWidthConfig(widthMultiplier)}vw`;
        flexShrink.value = 0;
        flexGrow.value = 1;
        return;
      }

      if (fitPanels) {
        flexBasis.value = '0%';
        flexShrink.value = 1;
        flexGrow.value = getValidatedWidthConfig(widthMultiplier);
      } else {
        flexBasis.value = `${defaultWidth * getValidatedWidthConfig(widthMultiplier)}px`;
        flexShrink.value = 0;
        flexGrow.value = 1;
      }
    }

    function getValidatedWidthConfig(configValue) {
      if (!configValue || typeof configValue !== 'number') return 1;
      if (configValue > 10) return 10;
      return configValue;
    }

    function createContentView(view, i, panelIndex) {
      const defaultFonts = {
        fontSize: 16,
        minSize: 14,
        maxSize: 28
      }
      const { fontSize, minSize, maxSize } = getFontSizes(view, defaultFonts)

      const { connector, label } = view;
      const { component } = findComponent(connector.id);

      const type = connector.options?.type;
      const url: string | null = getContentUrl(type);
      if (!url) return;

      const actionEvents = {
        update: (value) => {
          tabs.value[i].props.fontSize = value;
        },
      };

      const actions = [{
        component: 'PanelZoomAction',
        props: {
          min: minSize, max: maxSize, step: 2, startValue: fontSize,
        },
        events: actionEvents,
      }];

      tabs.value = [...tabs.value, {
        component,
        label,
        props: { type, url, fontSize, panelIndex },
        actions,
      }];
    }

    function createAnnotationsView(view, i) {
      const annotationStore = useAnnotationsStore();
      const { connector, label } = view;
      const { component } = findComponent(connector.id);

      const url: string | undefined = item.value?.annotationCollection;

      if (!url) return;

      const selected = false;
      const actionEvents = {
        update: (value) => {
          if (value === null) return;
          if (value) annotationStore.selectAll();
          else annotationStore.selectNone();
        },
      };

      const viewEvents = {
        init: () => {
          tabs.value[i].actions[0].props.selected = false
        }
      }

      unsubscribe.value = annotationStore.$onAction(({
        name, args,
      }) => {
        if (tabs.value.length
          && tabs.value[i]?.actions?.length
          && (name === 'setActiveAnnotations')) {
          const activeAnnotations = args[0];
          const activeAmount = Object.keys(activeAnnotations).length;
          const filteredAmount = annotationStore.filteredAnnotations.length;
          let newSelected = activeAmount > 0 && activeAmount === filteredAmount;

          if (!newSelected && activeAmount > 0) newSelected = null;

          if (tabs.value[i].actions[0].props.selected !== newSelected) {
            tabs.value[i].actions[0].props.selected = newSelected;
          }
        }
      });

      const actions = [{
        component: 'PanelCheckAction',
        props: {
          selected,
          label: t('select_all'),
        },
        events: actionEvents,
      }];

      tabs.value = [...tabs.value, {
        component,
        label,
        props: { ...connector.options },
        actions,
        events: viewEvents
      }];
    }

    function createVariantsView(view) {
      const { connector, label } = view;
      const { component } = findComponent(connector.id);

      const actions = [{
        component: 'VariantsToggleModeAction',
        props: {
          selected: false,
          label: t('single_select_mode'),
        },
      }];

      tabs.value = [...tabs.value, {
        component,
        label,
        props: { ...connector.options },
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
        configStore.setContentType(contentItem.type.split('type=')[1]);
      }

      contentItem = item.value.content.find((c) => c.type.split('type=')[1] === type);

      return contentItem ? contentItem.url : null;
    }

    function onViewChange(index) {
      activeTabIndex.value = index;
      if (index !==2) {
        AnnotationUtils.removeWitnessesWrappers()
      }

      emit('active-view', activeTabIndex.value);
    }

    return {
      activeTabIndex,
      isLoading,
      tabs,
      onViewChange,
      flexBasis,
      flexGrow,
      flexShrink
    };
  },
};
</script>
