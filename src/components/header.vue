<template>
  <q-header
    id="header"
    elevated
    :class="$q.dark.isActive ? 'bg-black text-white' : 'bg-white text-black'"
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
        :config="config"
        :itemurls="itemurls"
        :manifests="manifests"
      />

      <ToggleIndex v-if="config.headers.toggle"
        :config="config"
        :panels="panels"
        class="
          col
          col-md-auto
          col-xs-12
          column-xs
          content-sm-center
          justify-sm-evenly
          row-sm"
        :imageurl="imageurl"
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
  #header {
    position: absolute;
    top: 0;
    left: 0;
  }
  .bar {
    margin-left: auto;
    margin-right: auto;
    max-width: 1200px;
  }
</style>
