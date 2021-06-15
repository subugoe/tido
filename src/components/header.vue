<template>
  <q-header :class="$q.dark.isActive ? 'bg-dark' : 'bg-secondary text-primary'">
    <div class="header__wrap">
      <q-toolbar v-if="config['header_section'].titles">
        <TitleBar
          v-if="manifests.length"
          class="col-xs-9"
          :collectiontitle="collectiontitle"
          :item="item"
          :manifests="manifests"
        />

        <Tools
          :config="config"
          :projectcolors="projectcolors"
          :standalone="standalone"
        />
      </q-toolbar>

      <div>
        <q-toolbar class="q-pb-sm">
          <Navbar
            v-if="config['header_section'].navigation"
            :itemurls="itemurls"
            :labels="config.labels"
            :manifests="manifests"
          />

          <q-space />

          <TogglePanels
            v-if="config['header_section'].toggle"
            :panels="panels"
          />

          <div
            v-if="!config['header_section'].titles"
          >
            <Tools
              :config="config"
              :projectcolors="projectcolors"
              :standalone="standalone"
            />
          </div>
        </q-toolbar>
      </div>
    </div>
  </q-header>
</template>

<script>
import Navbar from '@/components/navbar.vue';
import TitleBar from '@/components/titlebar.vue';
import TogglePanels from '@/components/togglebar/togglePanels.vue';
import Tools from '@/components/tools.vue';

export default {
  name: 'Header',
  components: {
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
    standalone: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.header__wrap {
  margin: 0 auto;
  max-width: 1200px;
}
</style>
