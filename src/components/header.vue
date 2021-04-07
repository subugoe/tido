<template>
  <q-header>
    <q-toolbar
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-secondary text-primary'"
      elevated
    >
      <Infobar
        v-if="config.headers.info && manifests.length"
        :collectiontitle="collectiontitle"
        :item="item"
        :manifests="manifests"
      />
    </q-toolbar>

    <q-toolbar
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-secondary text-primary'"
      elevated
    >
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
  </q-header>
</template>

<script>
import Infobar from '@/components/infobar.vue';
import Navbar from '@/components/navbar.vue';
import ToggleIndex from '@/components/togglebar/toggleIndex.vue';

export default {
  name: 'Header',
  components: {
    Infobar,
    Navbar,
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
  },
};
</script>

<style lang="scss" scoped>
header {
  left: 0;
  position: absolute;
  top: 0;
}

.bar {
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
}
</style>
