<template>
  <q-header :class="$q.dark.isActive ? 'bg-dark' : 'bg-secondary text-primary'">
    <ProjectHeader
      v-if="config.projectheader.show"
      :projectheader="projectheader"
    />
    <div class="header__wrap">
      <q-toolbar v-if="config.headers.info">
        <Infobar
          v-if="config.headers.info && manifests.length"
          class="col-xs-9"
          :collectiontitle="collectiontitle"
          :item="item"
          :manifests="manifests"
        />
        <div class="row no-wrap justify-end col-xs-3">
          <!-- TODO: make component out of the following and re-use it to avoid duplication -->
          <Language
            v-if="standalone"
            :config="config"
          />
          <Color :projectcolors="projectcolors" />
          <Softwareinfo />
        </div>
      </q-toolbar>

      <div>
        <q-toolbar class="q-pb-sm">
          <Navbar
            v-if="config.headers.navigation"
            :itemurls="itemurls"
            :labels="config.labels"
            :manifests="manifests"
          />

          <q-space />

          <TogglePanels
            v-if="config.headers.toggle"
            :panels="panels"
          />

          <div
            v-if="!config.headers.info"
            class="row no-wrap justify-end col-xs-3"
          >
            <!-- TODO: make component out of the following and re-use it to avoid duplication -->
            <Language
              v-if="standalone"
              :config="config"
            />
            <Color :projectcolors="projectcolors" />
            <Softwareinfo />
          </div>
        </q-toolbar>
      </div>
    </div>
  </q-header>
</template>

<script>
import Color from '@/components/color.vue';
import Infobar from '@/components/infobar.vue';
import Language from '@/components/language.vue';
import Navbar from '@/components/navbar.vue';
import Softwareinfo from '@/components/softwareinfo.vue';
import TogglePanels from '@/components/togglebar/togglePanels.vue';
import ProjectHeader from '@/components/projectheader.vue';

export default {
  name: 'Header',
  components: {
    Color,
    Infobar,
    Language,
    Navbar,
    Softwareinfo,
    TogglePanels,
    ProjectHeader,
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
    projectheader: {
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
</style>
