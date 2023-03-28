<template>
  <div
    class="header q-pa-md q-px-lg-lg"
    :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-3'"
    v-if="show"
  >
    <div class="flex items-start title-container">
      <TitleBar :item="item"/>
      <div class="q-ml-auto">
        <Tools/>
      </div>
    </div>
    <div v-if="item" class="flex column-xs row-md">
      <Navbar v-if="showNavbar"/>
      <PanelsToggle v-if="showPanelsToggle" class="flex justify-sm-end col q-mt-md q-mt-md-none" />
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/header/Navbar.vue';
import TitleBar from '@/components/header/TitleBar.vue';
import PanelsToggle from '@/components/header/PanelsToggle.vue';
import Tools from '@/components/header/Tools.vue';

export default {
  name: 'GlobalHeader',
  components: {
    Navbar,
    TitleBar,
    PanelsToggle,
    Tools,
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
    },
  },
};
</script>

<style lang="scss" scoped>
.title-container {
  @media (max-width: $breakpoint-sm-max) {
    flex-direction: column-reverse;
  }
}
</style>
