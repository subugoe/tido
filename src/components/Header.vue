<template>
  <q-header :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-2'">
    <div class="q-px-md q-py-md">
      <div class="flex items-start">
        <TitleBar v-if="item && manifests.length" class="" :item="item"/>
        <div class="col flex justify-end">
          <q-btn color="grey-6" flat :icon="icon('fasCog')"></q-btn>
<!--          <SoftwareInfo />-->
        </div>
      </div>
      <div v-if="item" class="flex">
        <Navbar v-if="config['header_section'].navigation"/>
        <PanelsToggle v-if="config['header_section'].toggle" class="flex justify-sm-end col" />
        <div v-if="!config['header_section'].titles">
          <Tools />
        </div>
      </div>
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
  },
  methods: {
    icon(name) {
      return Icons[name];
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
