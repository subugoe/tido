<template>
  <q-header
    elevated
    :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'"
    >
    <div class="bar row justify-between items-center">
      <Infobar v-if="config.headers.info && manifests.length"
        class="col-xs-12 q-pl-md"
        :collectiontitle="collectiontitle"
        :itemlabel="itemlabel"
        :manifests="manifests"
      />
    </div>

    <div class="bar row q-px-md justify-sm-between">
      <Navbar v-if="config.headers.navigation"
        class="
          col
          col-md-4
          col-xs-12
          column-xs
          justify-md-start
          justify-xs-center
          row-sm"
        :itemurls="itemurls"
        :labels="config.labels"
        :manifests="manifests"
      />

      <ToggleIndex v-if="config.headers.toggle"
        class="
          col
          col-md-auto
          col-xs-12
          column-xs
          content-sm-center
          justify-sm-evenly
          row-sm"
        :panels="panels"
      />
    </div>
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
    collectiontitle: String,
    config: Object,
    imageurl: String,
    itemlabel: String,
    itemurls: Array,
    manifests: Array,
    panels: Array,
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
