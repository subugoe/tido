<template>
  <q-header elevated class="bg-white text-black">
    <Infobar v-if="manifests.length"
      class="sub-viewer-1__info"
      :collection="collection"
      :itemurl="itemurl"
      :manifests="manifests"
    />

    <div class="sub-viewer-1__nav">
      <Togglebar :status="status" />

      <Navbar :itemurls="itemurls" :manifests="manifests" />
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
