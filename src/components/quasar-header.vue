<template>
  <q-header elevated class="bg-white text-black">
    <div class="bar row justify-center">
      <Infobar v-if="manifests.length"
        class="col-12 col-auto q-px-md"
        :collection="collection"
        :itemurl="itemurl"
        :manifests="manifests"
      />
    </div>

    <div class="bar row q-px-md justify-sm-between">
      <Navbar
        class="col col-xs-12 col-md-4 row justify-xs-center justify-md-start q-mb-md"
        :itemurls="itemurls"
        :manifests="manifests"
      />

      <Togglebar
        class="
          col
          column-xs
          col-xs-12
          col-md-auto
          row-sm
          justify-sm-evenly
          content-sm-center"
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
    collection: Object,
    itemurl: String,
    itemurls: Array,
    manifests: Array,
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
