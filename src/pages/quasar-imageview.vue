<template>
  <q-page v-if="image && imageurl">
    <Toolbar heading="Image" />
    <q-separator />

    <OpenSeadragon
      :key="imageurl"
      :imageurl="imageurl"
      :vectors="vectors"
      >
    </OpenSeadragon>
  </q-page>
</template>

<script>
import OpenSeadragon from '@/components/openseadragon.vue';
import Toolbar from '@/components/quasar-toolbar.vue';

export default {
  name: 'ImageView',
  components: {
    OpenSeadragon,
    Toolbar,
  },
  props: {
    imageurl: String,
    vectors: Object,
  },
  data() {
    return {
      image: true,
    };
  },
  mounted() {
    this.$root.$emit('update-view', this.$route.path.slice(1));
  },
};
</script>
