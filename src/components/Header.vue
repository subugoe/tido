<template>
  <q-header :class="$q.dark.isActive ? 'bg-dark' : 'bg-secondary'">
    <div
      v-if="
        !!$route.query.source &&
          $route.query.source === config.breadcrumbNavigation.source
      "
      :class="$q.dark.isActive ? 'bg-white' : 'bg-accent'"
    >
      <BreadCrumbNavigation :config="config" />
    </div>

    <div class="header__wrap">
      <q-toolbar
        v-if="config['header_section'].titles"
        class="row toolbar"
      >
        <TitleBar
          v-if="manifests.length"
          class="col-xs-12 col-sm-9 q-mb-xs-xs q-mb-sm-none"
          :item="item"
        />

        <Tools
          class="
            col-xs-12 col-sm-3
            items-center
            justify-sm-end justify-xs-center
            order-xs-first order-sm-last
          "
        />
      </q-toolbar>

      <q-toolbar class="row toolbar">
        <Navbar
          v-if="config['header_section'].navigation"
          :labels="config.labels"
          :manifests="manifests"
          class="
            row
            justify-center justify-sm-start
            col-xs-12 col-sm-6
            q-mb-xs-md q-mb-sm-none
          "
        />

        <q-space />

        <PanelsToggle
          v-if="config['header_section'].toggle"
          class="
            panel-toggle
            row
            justify-center justify-sm-end
            col-xs-12 col-sm-6
            q-mb-xs-sm q-mb-sm-none
            order-xs-first order-sm-last
          "
        />

        <div v-if="!config['header_section'].titles">
          <Tools />
        </div>
      </q-toolbar>
    </div>
  </q-header>
</template>

<script>
import BreadCrumbNavigation from '@/components/BreadcrumbNavigation.vue';
import Navbar from '@/components/Navbar.vue';
import TitleBar from '@/components/TitleBar.vue';
import PanelsToggle from '@/components/togglebar/PanelsToggle.vue';
import Tools from '@/components/Tools.vue';

export default {
  name: 'Header',
  components: {
    BreadCrumbNavigation,
    Navbar,
    TitleBar,
    PanelsToggle,
    Tools,
  },
  computed: {
    manifests() {
      return this.$store.getters['contents/manifests'];
    },
    config() {
      return this.$store.getters['config/config'];
    },
    projectcolors() {
      return this.config.colors;
    },
    item() {
      return this.$store.getters['contents/item'];
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
  @media (max-width: $breakpoint-xs-max) {
    flex-wrap: wrap !important;
  }
}
</style>
