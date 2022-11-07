<template>
  <q-header :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-3'" v-if="show">
    <div class="q-px-md q-py-md">
      <div class="flex items-start">
        <TitleBar v-if="item && manifests.length" class="" :item="item"/>
        <div class="col flex justify-end">
          <Tools/>
        </div>
      </div>
      <div v-if="item" class="flex">
        <Navbar v-if="showNavbar"/>
        <PanelsToggle v-if="showPanelsToggle" class="flex justify-sm-end col" />
      </div>
    </div>
  </q-header>
</template>

<script>
import BreadCrumbNavigation from 'components/BreadcrumbNavigation.vue';
import Navbar from 'components/header/Navbar.vue';
import TitleBar from 'components/header/TitleBar.vue';
import PanelsToggle from 'components/header/PanelsToggle.vue';
import Tools from 'components/header/Tools.vue';
import SoftwareInfo from "components/SoftwareInfo.vue";

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
    show() {
      return this.config.header?.show;
    },
    manifests() {
      return this.$store.getters['contents/manifests'];
    },
    config() {
      return this.$store.getters['config/config'];
    },
    item() {
      return this.$store.getters['contents/item'];
    },
    showNavbar() {
      return this.config.header?.navigation || true;
    },
    showPanelsToggle() {
      return this.config.header?.panelsToggle !== undefined ? this.config.header?.panelsToggle : true;
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
