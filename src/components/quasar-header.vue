<template>
  <q-header elevated class="bg-white text-black">
    <div>
    <Infobar v-if="manifests.length"
      class="q-px-md"
      :collection="collection"
      :itemurl="itemurl"
      :manifests="manifests"
    />
    </div>

    <div class="row justify-center q-px-md q-mb-md">
      <Navbar
        class="col col-md-4"
        :itemurls="itemurls"
        :manifests="manifests"
      />

      <Togglebar
        class="col col-md-8"
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
div {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
</style>
