<template>
  <q-header :class="$q.dark.isActive ? 'bg-dark' : 'bg-secondary text-primary'">
    <div
      v-if="config.breadcrumbNavigation.show"
      :class="$q.dark.isActive ? 'bg-white' : 'bg-accent'"
    >
      <BreadCrumbNavigation
        v-if="$route.query.source === 'external'"
        :config="config"
      />
    </div>

    <div class="header__wrap">
      <q-toolbar
        v-if="config['header_section'].titles"
        class="row toolbar"
      >
        <TitleBar
          v-if="manifests.length"
          class="col-xs-12 col-sm-9 q-mb-xs-md q-mb-sm-none"
          :collectiontitle="collectiontitle"
          :item="item"
          :manifests="manifests"
        />

        <Tools
          class="col-xs-12 col-sm-3 items-center justify-center order-xs-first order-sm-last"
          :config="config"
          :projectcolors="projectcolors"
        />
      </q-toolbar>

      <q-toolbar class="row toolbar">
        <Navbar
          v-if="config['header_section'].navigation"
          :default-view="defaultView"
          :itemurls="itemurls"
          :labels="config.labels"
          :manifests="manifests"
          class="row justify-center justify-sm-start col-xs-12 col-sm-8 q-mb-xs-md q-mb-sm-none"
        />

        <q-space />

        <TogglePanels
          v-if="config['header_section'].toggle"
          :panels="panels"
          class="row justify-center justify-sm-end col-xs-12 col-sm-4 q-mb-xs-sm q-mb-sm-none order-xs-first order-sm-last"
        />

        <div
          v-if="!config['header_section'].titles"
        >
          <Tools
            :config="config"
            :projectcolors="projectcolors"
          />
        </div>
      </q-toolbar>
    </div>
  </q-header>
</template>

<script>
import BreadCrumbNavigation from '@/components/breadcrumbnavigation.vue';
import Navbar from '@/components/navbar.vue';
import TitleBar from '@/components/titlebar.vue';
import TogglePanels from '@/components/togglebar/togglePanels.vue';
import Tools from '@/components/tools.vue';

export default {
  name: 'Header',
  components: {
    BreadCrumbNavigation,
    Navbar,
    TitleBar,
    TogglePanels,
    Tools,
  },
  props: {
    collectiontitle: {
      type: String,
      default: () => '',
    },
    config: {
      type: Object,
      default: () => {},
    },
    defaultView: {
      type: Function,
      default: () => {},
    },
    imageurl: {
      type: String,
      default: () => '',
    },
    item: {
      type: Object,
      default: () => {},
    },
    itemurls: {
      type: Array,
      default: () => [],
    },
    manifests: {
      type: Array,
      default: () => [],
    },
    panels: {
      type: Array,
      default: () => [],
    },
    projectcolors: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang="scss" scoped>
.header__wrap {
  margin: 0 auto;
  max-width: 1200px;
}

.toolbar {
  @media (max-width: 599px) {
    flex-wrap: wrap !important;
  }
}
</style>
