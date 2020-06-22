<template>
  <q-header elevated class="bg-white text-black">
    <div class="bar row justify-between items-center">
      <Infobar v-if="config.headers.info && manifests.length"
        class="col-xs-12 q-pl-md"
        :collectiontitle="collectiontitle"
        :manifests="manifests"
        :pagelabel="pagelabel"
      />
    </div>

    <div class="bar row q-px-md justify-sm-between">
      <Navbar v-if="config.headers.navigation"
        class="
          col
          col-md-6
          col-xs-12
          column-xs
          justify-md-start
          justify-xs-center
          row-sm
          "
        :config="config"
        :itemurls="itemurls"
        :manifests="manifests"
      />

      <Togglebar v-if="config.headers.toggle"
        class="
          col
          col-md-auto
          col-xs-12
          column-xs
          content-sm-center
          justify-sm-evenly
          row-sm
          "
        :status="status"
      />
    </div>
  </q-header>
</template>

<script>
import Infobar from '@/components/infobar.vue';
import Navbar from '@/components/navbar.vue';
import Togglebar from '@/components/togglebar.vue';

export default {
  name: 'Header',
  components: {
    Infobar,
    Navbar,
    Togglebar,
  },
  props: {
    collectiontitle: String,
    config: Object,
    itemurls: Array,
    manifests: Array,
    pagelabel: String,
    status: Object,
  },
};
</script>

<style scoped>
.bar {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
</style>
