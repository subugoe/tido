<template>
  <div>
    <q-item-label v-if="!isLink()" overline class="text-uppercase">
      {{ $t(label) }}
    </q-item-label>
    <MetadataLink
      v-if="isLink()"
      :url="item.key"
      :text="item.value"
    />
    <ContentUrls v-else :content="item.value" />
    <MetadataItem
      v-for="(childItem, idx) in childItems"
      :key="idx"
      :item="childItem"
    />
  </div>
</template>

<script>
import MetadataLink from 'components/metadata/MetadataLink';
import ContentUrls from 'components/ContentUrls';

export default {
  name: 'MetadataItem',
  components: { ContentUrls, MetadataLink },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    label() {
      return this.item.key;
    },
    childItems() {
      return this.item.metadata || [];
    },
  },
  methods: {
    mounted() {

    },
    isLink() {
      const regex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
      const matches = this.item.key.match(regex);

      return matches !== null;
    },
  },
};
</script>

<style scoped>

</style>
