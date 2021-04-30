<template>
  <q-header :class="$q.dark.isActive ? 'bg-dark' : 'bg-secondary text-primary'">
    <div class="header__wrap">
      <q-toolbar>
        <Infobar
          v-if="config.headers.info && manifests.length"
          class="col-xs-9"
          :collectiontitle="collectiontitle"
          :item="item"
          :manifests="manifests"
        />
        <div class="row no-wrap justify-end col-xs-3">
          <Language v-if="standalone" />
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

          <ToggleIndex
            v-if="config.headers.toggle"
            :panels="panels"
          />
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
import ToggleIndex from '@/components/togglebar/toggleIndex.vue';

export default {
  name: 'Header',
  components: {
    Color,
    Infobar,
    Language,
    Navbar,
    Softwareinfo,
    ToggleIndex,
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
