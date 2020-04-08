<template>
  <q-page v-if="text">
    <Toolbar heading="Text" />
    <q-separator />

    <Content
      :key="itemurl"
      :itemurl="itemurl"
      :request="request"
      >
    </Content>
  </q-page>
</template>

<script>
import Content from '@/components/content.vue';
import Toolbar from '@/components/quasar-toolbar.vue';

export default {
  name: 'TextView',
  components: {
    Content,
    Toolbar,
  },
  props: {
    itemurl: String,
    request: Function,
  },
  data() {
    return {
      text: true,
    };
  },
  mounted() {
    this.$root.$emit('update-view', this.$route.path.slice(1));
  },
};
</script>
