<template>
  <q-header :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-2'">
    <div
      v-if="!!$route.query.source &&$route.query.source === config.breadcrumbNavigation.source"
      :class="$q.dark.isActive ? 'bg-white' : 'bg-primary'"
    >
      <BreadCrumbNavigation :config="config" />
    </div>

    <div class="flex q-px-md q-py-sm">
      <q-toolbar class="q-px-none">
        <TitleBar v-if="item && manifests.length" class="" :item="item"/>
        <div v-else class="">
          <h1 class="text-h3 text-bold q-mt-xs" :class="$q.dark.isActive ? 'text-light' : 'text-dark'">
            TIDO Viewer
          </h1>
        </div>
<!--        <Navbar v-if="config['header_section'].navigation" class="q-ml-md"/>-->

        <div class="col flex justify-end">
          <q-btn color="grey-5" flat :icon="icon('fasCog')"></q-btn>
<!--          <SoftwareInfo />-->
        </div>
      </q-toolbar>
      <q-toolbar v-if="item" class="q-px-none row toolbar">
        <q-btn
          unelevated
          :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'primary'"
          size="xs"
          padding="xs"
          class="q-px-sm q-mr-sm previous-item"
        >
          <q-icon :name="icon('fasArrowLeft')" size="16px" class="q-pr-xs"/>
        </q-btn>
        <h2 class="text-h4 text-bold q-mt-none q-mb-none" :class="$q.dark.isActive ? 'text-light' : 'text-dark'">
          <span>{{ manifestTitle }}</span>
          <q-btn
            unelevated
            :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'primary'"
            size="xs"
            padding="xs"
            class="q-px-sm q-ml-sm previous-item"
          >
            <q-icon :name="icon('fasArrowRight')" size="16px" class="q-pl-xs"/>
          </q-btn>
          <q-icon
            class="q-px-lg"
            size="xs"
            :color="$q.dark.isActive ? 'white' : 'grey-2'"
            :name="icon('fasChevronRight')"
          />
          <q-btn
            unelevated
            :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'primary'"
            size="xs"
            padding="xs"
            class="q-px-sm q-mr-sm previous-item"
          >
            <q-icon :name="icon('fasArrowLeft')" size="16px" class="q-pr-xs"/>

          </q-btn>
          <span>{{ $t('Sheet') }} {{ item.n }}</span>
          <q-btn
            unelevated
            :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'primary'"
            size="xs"
            padding="xs"
            class="q-px-sm q-ml-sm previous-item"
          >
            <q-icon :name="icon('fasArrowRight')" size="16px" class="q-pl-xs"/>
          </q-btn>
        </h2>
        <q-space />
        <PanelsToggle
          v-if="config['header_section'].toggle && false"
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
import SoftwareInfo from "components/SoftwareInfo.vue";
import * as Icons from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Header',
  components: {
    BreadCrumbNavigation,
    Navbar,
    TitleBar,
    PanelsToggle,
    Tools,
    SoftwareInfo
  },
  props: {
    configErrorTitle: {
      type: String,
      default: () => '',
    },
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
    manifestTitle() {
      return this.$store.getters['contents/manifest']?.label;
    },
  },
  methods: {
    icon(name) {
      return Icons[name];
    }
  }
};
</script>

<style lang="scss" scoped>
.header__wrap {
  margin: 0 auto;
  max-width: 1200px;
}

.q-toolbar {
  @media (max-width: $breakpoint-xs-max) {
    flex-wrap: wrap !important;
  }
}
</style>
