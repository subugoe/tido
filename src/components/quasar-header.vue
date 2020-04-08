<template>
  <q-header elevated class="bg-white text-black">
    <Infobar v-if="manifests.length"
      :collection="collection"
      :itemurl="itemurl"
      :manifests="manifests"
      :vectors="vectors"
      >
    </Infobar>

    <div class="sub-viewer-1__nav">
      <Togglebar
        :status="status"
        :vectors="vectors"
        >
      </Togglebar>

      <Navbar
        :itemurls="itemurls"
        :manifests="manifests"
        :vectors="vectors"
        >
      </Navbar>
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
    vectors: Object,
  },
};
</script>
